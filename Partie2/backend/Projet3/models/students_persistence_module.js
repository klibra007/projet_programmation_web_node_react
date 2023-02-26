const { json } = require('express');
const fs = require('fs');
const { resolve } = require('path');
const path = require('path');


const login = (matricule, password) => {
    const objPromise = new Promise((resolve, reject) => {
        getStudents()
            .then(objStudents => {
                let student = objStudents.students.filter(student => student.matricule === matricule);

                if(student.length > 0){
                    student = student[0];
                    if(student.matricule === matricule && student.password === password){
                        resolve({"Result": "OK",
                        "Firstname": student.firstname,
                        "Lastname": student.lastname});
                    }
                    else {
                        reject({"Result": "PASOK"})
                    }
                }
                else {
                    reject({"Result": "PASOK"});
                }
            })
            .catch(error => reject(error));
    })

    return objPromise;
}

const getStudents = () => {
    const objPromise = new Promise((resolve, reject) => {
        const objReadableStream = fs.createReadStream("./data/students.json");

        let data = "";
        objReadableStream.on('data', (chunk) => {
            data += chunk;
        })

        objReadableStream.on('end', () => {
            if (resolve) {
                resolve(JSON.parse(data));
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
                const duplicateStudents = objStudents.students.
                    filter(current => current.id === student.id);

                if (duplicateStudents.length === 0) {
                    objStudents.students.push(student)
                    saveStudents(objStudents)
                    resolve(student)
                }
            })
            .catch(error => reject(error));
    })

    return objPromise;
}

const deleteStudent = student => {
    const objPromise = new Promise((resolve, reject) => {
        getStudents()
            .then(objStudents => {
                objStudents.students = objStudents.students.
                    filter(current => current.id !== student.id);

                saveStudents(objStudents)
                resolve(student)
            })
            .catch(error => reject(error));
    })

    return objPromise;
}

const updateStudent = (student) => {
    const objPromise = new Promise((resolve, reject) => {
        getStudents()
            .then(objStudents => {
                objStudents.students = objStudents.students.
                    map(current => {
                        if (current.id === student.id) {
                            return student;
                        }
                        else {
                            return current;
                        }
                    })

                saveStudents(objStudents)
            })
            .catch(error => reject(error));
    })

    return objPromise;
}

let updateStudentById = (id, dataStudent) => {
    const objPromise = new Promise((resolve, reject) => {
        getStudents()
            .then(objStudents => {
                objStudents.students = objStudents.students.
                    map(current => {
                        if(current.id === id) {
                            
                            return dataStudent;
                        }
                        else {
                            return current;
                        }
                    })
                    
                    saveStudents(objStudents)
                    resolve(dataStudent);
            })
            .catch(error => reject(error));
    })

    return objPromise;
}

const deleteStudentById = (id) => {
    const objPromise = new Promise((resolve, reject) => {
        getStudents()
            .then(objStudents => {
                let deleteStudent = objStudents.students.filter(current => current.id === id);

                objStudents.students = objStudents.students.
                    filter(current => current.id !== id);

                saveStudents(objStudents)
                resolve(deleteStudent)
            })
            .catch(error => reject(error));
    })

    return objPromise;

}

const getStudentByLastName = (lastname) => {
    const objPromise = new Promise((resolve, reject) => {
        getStudents()
            .then(objStudents => {
                const tabStudents = objStudents.students;
                const filteredStudents = tabStudents.filter(student => student.lastname === lastname)

                if (filteredStudents.length > 0) {
                    resolve(filteredStudents);
                }
                else {
                    reject({ error: "Student not found" });
                }
            })
            .catch(error => reject(error));
    })
    return objPromise;
}

module.exports = { getStudents, getStudentById, addStudent, deleteStudent, updateStudent, deleteStudentById, getStudentByLastName, updateStudentById, login };