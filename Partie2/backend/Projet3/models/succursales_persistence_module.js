const { json } = require('express');
const fs = require('fs');
const { resolve } = require('path');
const path = require('path');

const getSuccursales = () => {
    const objPromise = new Promise((resolve, reject) => {
        const objReadableStream = fs.createReadStream("./data/succursales.json");

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

const saveSuccursales = (succursales) => {
    const objPromise = new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, "../data/succursales.json"), JSON.stringify(succursales), error => {
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

const countSuccursales = (matricule) => {
    const objPromise = new Promise((resolve, reject) => {
        getSuccursales()
        .then(objSuccursales => {
            let succursales = objSuccursales.succursales.filter(succursale => succursale.Matricule === matricule);
            resolve({'Result': `${succursales.length}`})
        })
        .catch(error => reject(error));
    })

    return objPromise;
}

const displaySuccursales = (matricule) => {
    const objPromise = new Promise((resolve, reject ) => {
        getSuccursales()
        .then(objSuccursales => {
            const succursalesTab = objSuccursales.succursales.filter(succursale => succursale.Matricule === matricule)
                .map((succursale) => {
                const dataSuccursale = [
                    succursale.Ville,
                    succursale.Budget
                ]
                return dataSuccursale;
            })

            if(succursalesTab.length > 0) {
                let data = [];

                succursalesTab.forEach(succursale => {
                    let obj = {"Ville": succursale[0],
                                "Budget": succursale[1]}
                    data.push(obj)
                });
                resolve({"Result": data});
            }

            else {
                reject({"Result": "AUCUNE"});
            }
        })
        .catch(error => reject(error))
    })
    
    return objPromise;  
}

const addSuccursale = (succursale, matricule) => {
    const objPromise = new Promise((resolve, reject) => {
        getSuccursales()
            .then(objSuccursales => {
                let succursaleData = {
                        "Ville": succursale.Ville,
                        "Budget": succursale.Budget,
                        "Matricule": succursale.Aut.substring(0, 7)
                    };

                const dupplicateSuccursale = objSuccursales.succursales.filter(succursale => succursale.Matricule === matricule)
                    .filter(current => current.Ville === succursale.Ville);
                if(dupplicateSuccursale.length === 0) {
                    objSuccursales.succursales.push(succursaleData);
                    saveSuccursales(objSuccursales);
                    resolve({"Result": "OKI"})
                }
                else if (dupplicateSuccursale.length > 0) {
                    if(dupplicateSuccursale[0].Budget !== succursale.Budget) {
                        console.log("budget dupplicate= " + dupplicateSuccursale[0].Budget)
                        console.log("budget succursale= " + succursale.Budget)
                        updateSuccursale(succursaleData, matricule)
                            .then(data => resolve(data))
                            .catch(error => reject(error));
                    }

                    else {
                        reject({"Result": "PASOK"});
                    }
                }
            })
    })

    return objPromise;
}


const updateSuccursale = (succursale, matricule) => {
    const objPromise = new Promise((resolve, reject) => {
        getSuccursales()
            .then(objSuccursales => {
                objSuccursales.succursales = objSuccursales.succursales
                    .map(current => {
                        if(current.Ville === succursale.Ville && current.Matricule === matricule) {
                            return succursale;
                        }
                        else  {
                            return current;
                        }
                    })
                saveSuccursales(objSuccursales);
                resolve({"Result": "OKM"});
            })
            .catch(error => reject(error));
    })

    return objPromise;
}

const deleteSuccursale = (succursale, matricule) => {
    const objPromise = new Promise((resolve, reject) => {
        getSuccursales()
            .then(objSuccursales => {
                const succursalesLength = objSuccursales.succursales.length;
                const succursaleToDelete = objSuccursales.succursales
                    .filter((current) => (current.Matricule === matricule && current.Ville === succursale.Ville));

                const indexSuccursale = objSuccursales.succursales.indexOf(succursaleToDelete[0]);
                
                if(indexSuccursale !== -1){
                    objSuccursales.succursales.splice(indexSuccursale, 1);
                }

                if(objSuccursales.succursales.length !== succursalesLength) {
                    saveSuccursales(objSuccursales);
                    resolve({"Result": "OK"});
                }
                
                else {
                    reject({"Result": "PASOK"});
                }
            })
    })

    return objPromise;
}

const displayBudgetSuccursale = (succursale, matricule) => {
    const objPromise = new Promise((resolve, reject) => {
        getSuccursales()
            .then(objSuccursales => {
                const succursales = objSuccursales.succursales
                    .filter(current => current.Ville === succursale.Ville && current.Matricule == matricule);
                
                if(succursales.length > 0) {
                    const budget = succursales[0].Budget;
                    resolve({"Result": `${budget}`})
                }
                
                else {
                    reject({"Result": "PASOK"});
                }
            })
    })

    return objPromise;
}

const resetSuccursales = (matricule) => {
    const objPromise = new Promise((resolve, reject) => {
        getSuccursales()
            .then(objSuccursales => {
                objSuccursales.succursales = objSuccursales.succursales.filter(current => current.Matricule !== matricule);
                saveSuccursales(objSuccursales);
                resolve({"Result": "OK"})
            })
    })

    return objPromise;
}

module.exports = { getSuccursales, countSuccursales, displaySuccursales, addSuccursale, deleteSuccursale, displayBudgetSuccursale, resetSuccursales };