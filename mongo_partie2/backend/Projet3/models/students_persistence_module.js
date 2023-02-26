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

const saveStudents = (students) => {
    const objPromise = new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, "../data/students.json"), JSON.stringify(students), error => {
            if (error) {
                reject(error);
            }
            else {
                resolve({ "Success": "Fichier sauvegardé avec succès." })
            }
        })
    })

    return objPromise;
}

const addStudent = (student) => {
    const objPromise = new Promise((resolve, reject) => {
        getStudents()
            .then(objStudents => {
                const duplicateStudents = objStudents.
                    filter(current => current.id === student.id);

                if (duplicateStudents.length === 0) {
                    new Student(student).save()  
                        .then(() => console.log(`Sauvegarde de l'étudiant ${JSON.stringify(student)} réussie!!`))
                        .catch((error) => console.log("Sauvegarde étudiant échouée!! La raison est " + error))
                    resolve(student)
                }
            })
            .catch(error => reject(error));
    })

    return objPromise;
}
module.exports = { getStudents, getStudentById, addStudent, login };