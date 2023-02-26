var express = require('express');
var router = express.Router();
const { login, addStudent } = require('../models/students_persistence_module')

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/connexion', (req, res) => {
    res.header('Content-Type', 'application/json');
    console.log(req.body);
    const donneesRecues = new URLSearchParams(req.body);
    const regDonneesRecues = /^Action=Connexion&Mat=\d{7}&Mdp=[A-Za-z]{1,6}\d{5}$/;

    if (regDonneesRecues.test(donneesRecues)) {
        const matricule = req.body.Mat;
        const password = req.body.Mdp;

        console.log("Matricule= " + matricule + "\n" + "Password= " + password)

        login(matricule, password)
            .then(data => res.send(JSON.stringify(data)))
            .catch(error => res.send(JSON.stringify(error)));
    }
    else {
        res.send(JSON.stringify({"Result": "ERREUR"}))
    }
})

router.post("/register", (req, res) => {
    res.header('Content-Type', 'application/json');
    console.log(req.body);
    addStudent(req.body)
        .then(student => {
            res.send(student)
        })
        .catch(error => res.send(error));
})



module.exports = router;
