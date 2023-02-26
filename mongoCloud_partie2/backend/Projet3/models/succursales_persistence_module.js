const { json } = require('express');
const fs = require('fs');
const { resolve } = require('path');
const path = require('path');
const Succursale = require('./succursales.model');

const getSuccursales = () => {
    const objPromise = new Promise((resolve, reject) => {
        // MongoDb find
        Succursale.find()
            .then((succursales) => {
                if (resolve) {
                    resolve(succursales);
                }
                else {
                    reject({ error });
                }
            })
    })

    return objPromise;
}

const countSuccursales = (matricule) => {
    const objPromise = new Promise((resolve, reject) => {
        getSuccursales()
            .then(objSuccursales => {
                let succursales = objSuccursales.filter(succursale => succursale.Matricule === matricule);
                resolve({ 'Result': `${succursales.length}` })
            })
            .catch(error => reject(error));
    })

    return objPromise;
}

const displaySuccursales = (matricule) => {
    const objPromise = new Promise((resolve, reject) => {
        getSuccursales()
            .then(objSuccursales => {
                const succursalesTab = objSuccursales.filter(succursale => succursale.Matricule === matricule)
                    .map((succursale) => {
                        const dataSuccursale = [
                            succursale.Ville,
                            succursale.Budget
                        ]
                        return dataSuccursale;
                    })

                if (succursalesTab.length > 0) {
                    let data = [];

                    succursalesTab.forEach(succursale => {
                        let obj = {
                            "Ville": succursale[0],
                            "Budget": succursale[1]
                        }
                        data.push(obj)
                    });
                    resolve({ "Result": data });
                }

                else {
                    reject({ "Result": "AUCUNE" });
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

                const dupplicateSuccursale = objSuccursales.filter(succursale => succursale.Matricule === matricule)
                    .filter(current => current.Ville === succursale.Ville);
                if (dupplicateSuccursale.length === 0) {
                    new Succursale(succursaleData).save()
                        .then(() => console.log(`Sauvegarde de la succursale ${JSON.stringify(succursaleData)} réussie!!`))
                        .catch((error) => console.log("Sauvegarde succursale échouée!! La raison est " + error))
                    resolve({ "Result": "OKI" })
                }
                else if (dupplicateSuccursale.length > 0) {
                    if (dupplicateSuccursale[0].Budget !== succursale.Budget) {
                        console.log("budget dupplicate= " + dupplicateSuccursale[0].Budget)
                        console.log("budget succursale= " + succursale.Budget)
                        updateSuccursale(succursaleData, matricule)
                            .then(data => resolve(data))
                            .catch(error => reject(error));
                    }

                    else {
                        reject({ "Result": "PASOK" });
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
                objSuccursales
                    .filter(succursale => succursale.Matricule === matricule)
                    .find(current => {
                        if (current.Ville === succursale.Ville && current.Matricule === matricule) {
                            Succursale.updateOne({ Budget: current.Budget }, { Budget: succursale.Budget }, (err) => {
                                if (err) {
                                    console.log("Update succursale échouée!! La raison est " + error)
                                }
                                else {
                                    console.log(`Update de la succursale de ${JSON.stringify(succursale.Ville)} réussie!!`)
                                    resolve({ "Result": "OKM" });
                                }
                            })
                        }
                    })

            })
            .catch(error => reject(error));
    })

    return objPromise;
}

const deleteSuccursale = (succursale, matricule) => {
    const objPromise = new Promise((resolve, reject) => {
        Succursale.findOneAndDelete({ Matricule: matricule, Ville: succursale.Ville }, (err, message) => {
            if (err) {
                console.log("Delete succursale échouée!! La raison est " + error)
            }
            else {
                if (message !== null) {
                    console.log(`Delete de la succursale de ${JSON.stringify(succursale.Ville)} réussie!!`)
                    console.log(message)
                    resolve({ "Result": "OK" });
                }
                else {
                    console.log(`Delete de la succursale de ${JSON.stringify(succursale.Ville)} non réussie!!`)
                    reject({ "Result": "PASOK" });
                }
            }
        })
    })
    return objPromise;
}

const displayBudgetSuccursale = (succursale, matricule) => {
    const objPromise = new Promise((resolve, reject) => {

        Succursale.find({ Ville: succursale.Ville, Matricule: matricule }, (err, result) => { 
            if(err){
                console.log("Affichage budget succursale échouée!! La raison est " + error)
            }
            else{
                console.log("le result est : " + result[0])
                if (result[0]!== undefined ) {
                    let objBudget = Object.values(result[0])[2]; 
                    Budget = Object.values(objBudget)[2]
                    console.log(`Affichage du budget ${Budget}$ de la succursale de ${JSON.stringify(succursale.Ville)} réussie!!`)
                    console.log(result)
                    resolve({ Result: `${Budget}` });
                }
                else {
                    console.log(`Affichage du budget de la succursale de ${JSON.stringify(succursale.Ville)} non réussie!!`)
                    reject({ "Result": "PASOK" });
                }
            }
        } )
    })
    return objPromise;
}

const resetSuccursales = (matricule) => {
    const objPromise = new Promise((resolve, reject) => {
        Succursale.deleteMany({Matricule: matricule})
        .then(() => {
            console.log('Toutes les succursales ont été supprimées');
            resolve({ "Result": "OK" });
        })
        .catch(error => console.log(error));
    })

    return objPromise;
}

module.exports = { getSuccursales, countSuccursales, displaySuccursales, addSuccursale, deleteSuccursale, displayBudgetSuccursale, resetSuccursales };