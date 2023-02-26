const fs = require('fs');
const path = require('path');
const Student = require('./students.model')


const login = (matricule, password) => {
    const objPromise = new Promise((resolve, reject) => {
        getStudents()
            .then(objStudents => {
                let student = objStudents.filter(student => student.matricule === matricule);

                if (student.length > 0) {
                    student = student[0];
                    if (student.matricule === matricule && student.password === password) {
                        resolve({
                            "Result": "OK",
                            "Firstname": student.firstname,
                            "Lastname": student.lastname
                        });
                    }
                    else {
                        reject({ "Result": "PASOK" })
                    }
                }
                else {
                    reject({ "Result": "PASOK" });
                }
            })
            .catch(error => reject(error));
    })

    return objPromise;
}


const getStudents = () => {
    const objPromise = new Promise((resolve, reject) => {

        //MongoDb Find
        Student.find()
            .then((students) => {
                if (resolve) {
                    resolve(students)
                }
                else {
                    reject({ error });
                }
            })
    })

    return objPromise;
}

const getStudentById = (id) => {
    const objPromise = new Promise((resolve, reject) => {
        getStudents()
            .then(objStudents => {
                const tabStudents = objStudents.students;
                const filteredStudents = tabStudents.filter(student => student.id === id)

                if (filteredStudents.length > 0) {
                    resolve(filteredStudents[0]);
                }
                else {
                    reject({ error: "Student not found" });
                }
            })
            .catch(error => reject(error));
    })
    return objPromise;
}

const addStudent = (student) => {
    const objPromise = new Promise((resolve, reject) => {

        getStudents()
            .then(objStudents => {
                const duplicateStudents = objStudents.
                    filter(current => current.matricule === student.matricule);

                let count = objStudents.length;

                if (duplicateStudents.length === 0) {
                    new Student(student).save()
                        .then(() => console.log(`Sauvegarde de l'étudiant ${JSON.stringify(student)} réussie!!`))
                        .catch((error) => console.log("Sauvegarde étudiant échouée!! La raison est " + error))
                    resolve(student)
                }
                else {
                    Student.find().sort({ $natural: -1 }).limit(1) // récupération du dernier étudiant enregistré limit à 1 data
                        .then((result) => {
                            let lastMatricule = result[0].matricule;
                            resolve({ error: "PASOK", matricule: lastMatricule })
                        });

                }
            })
            .catch(error => reject(error));
    })

    return objPromise;
}
module.exports = { getStudents, getStudentById, addStudent, login };