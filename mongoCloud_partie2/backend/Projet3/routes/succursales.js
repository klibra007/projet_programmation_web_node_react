var express = require('express');
var router = express.Router();
const { countSuccursales, displaySuccursales, addSuccursale, deleteSuccursale, displayBudgetSuccursale, resetSuccursales } = require('../models/succursales_persistence_module')

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/compteSuccursales', (req, res) => {
  res.header('Content-Type', 'application/json');
  console.log(req.body);
  const donneesRecues = new URLSearchParams(req.body);
  const regDonneesRecues = /^Action=Succursale-Compte&Aut=\d{7}\d{5}$/;

  if (regDonneesRecues.test(donneesRecues)) {
    const matricule = req.body.Aut.substring(0, 7);
    const password = req.body.Aut.substring(7, 11);

    console.log("Matricule= " + matricule + "\n" + "Chiffres Password= " + password)

    countSuccursales(matricule)
      .then(data => res.send(JSON.stringify(data)))
      .catch(error => res.send(JSON.stringify(error)));
  }
  else {
    res.send(JSON.stringify({"Result": "ERREUR"}))
  }
})

router.post('/listeSuccursales', (req, res) => {
  res.header('Content-Type', 'application/json');
  console.log(req.body);
  const donneesRecues =  new URLSearchParams(req.body);
  const regDonneesRecues = /^Action=Succursale-Liste&Aut=\d{7}\d{5}$/;

  if (regDonneesRecues.test(donneesRecues)) {
    const matricule = req.body.Aut.substring(0, 7);
    const password = req.body.Aut.substring(7, 12);

    console.log("Matricule= " + matricule + "\n" + "Chiffres Password= " + password)

    displaySuccursales(matricule)
      .then(data => res.send(JSON.stringify(data)))
      .catch(error => res.send(JSON.stringify(error)));
  }
  else {
    res.send(JSON.stringify({"Result": "ERREUR"}))
  }
})

router.post('/ajoutSuccursales', (req, res) => {
  res.header('Content-Type', 'application/json');
  console.log(req.body);
  const donneesRecues = new URLSearchParams(req.body);
  const regDonneesRecues = /^Action=Succursale-Ajout&Aut=\d{7}\d{5}&Ville=[A-Za-z]+(\-?[A-Za-z]+)*&Budget=\d{3,7}$/;

  if (regDonneesRecues.test(donneesRecues)) {
    const ville = req.body.Ville;
    const budget = req.body.Budget;
    const matricule = req.body.Aut.substring(0, 7);

    console.log("Ville= " + ville + "\n" + "Budget= " + budget);

    addSuccursale(req.body, matricule)
      .then(data => res.send(JSON.stringify(data)))
      .catch(error => res.send(JSON.stringify(error)));
  }
  else {
    res.send(JSON.stringify({"Result": "ERREUR"}))
  }
})

router.post('/retraitSuccursales', (req, res) => {
  res.header('Content-Type', 'application/json');
  console.log(req.body);
  const donneesRecues = new URLSearchParams(req.body);
  const regDonneesRecues = /^Action=Succursale-Retrait&Aut=\d{7}\d{5}&Ville=[A-Za-z]+(\-?[A-Za-z]+)*$/;

  if (regDonneesRecues.test(donneesRecues)) {
    const matricule = req.body.Aut.substring(0, 7);
    const password = req.body.Aut.substring(8, req.body.Aut.length);
    const ville = req.body.Ville;

    console.log("Matricule= " + matricule + "\n" + "Chiffres Password= " + password + "\nVille= " + ville)

    deleteSuccursale(req.body, matricule)
      .then(data => res.send(JSON.stringify(data)))
      .catch(error => res.send(JSON.stringify(error)));
  }
  else {
    res.send(JSON.stringify({"Result": "ERREUR"}))
  }
})

router.post('/budgetSuccursales', (req, res) => {
  res.header('Content-Type', 'application/json');
  console.log(req.body);
  const donneesRecues = new URLSearchParams(req.body);
  const regDonneesRecues = /^Action=Succursale-Budget&Aut=\d{7}\d{5}&Ville=[A-Za-z]+(\-?[A-Za-z]+)*$/;

  if (regDonneesRecues.test(donneesRecues)) {
    const matricule = req.body.Aut.substring(0, 7);
    const password = req.body.Aut.substring(8, req.body.Aut.length);
    const ville = req.body.Ville;

    console.log("Matricule= " + matricule + "\n" + "Chiffres Password= " + password + "\nVille= " + ville)

    displayBudgetSuccursale(req.body, matricule)
      .then(data => res.send(JSON.stringify(data)))
      .catch(error => res.send(JSON.stringify(error)));
  }
  else {
    res.send(JSON.stringify({"Result": "ERREUR"}))
  }
})

router.post('/resetSuccursales', (req, res) => {
  res.header('Content-Type', 'application/json');
  console.log(req.body);
  const donneesRecues = new URLSearchParams(req.body);
  const regDonneesRecues = /^Action=Succursale-Suppression&Aut=\d{7}\d{5}$/;

  if (regDonneesRecues.test(donneesRecues)) {
    const matricule = req.body.Aut.substring(0, 7);
    const password = req.body.Aut.substring(7, 12);

    console.log("Matricule= " + matricule + "\n" + "Chiffres Password= " + password)

    resetSuccursales(matricule)
      .then(data => res.send(JSON.stringify(data)))
      .catch(error => res.send(JSON.stringify(error)));
  }
  else {
    res.send(JSON.stringify({"Result": "ERREUR"}))
  }
})



module.exports = router;
