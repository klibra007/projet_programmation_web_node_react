var express = require('express'); //Framework pour construire un serveur et des applications web sur NodeJS
var path = require('path'); // Module donnant des fonctionnalités pour accéder et interagir avec les fichiers
var cookieParser = require('cookie-parser'); // Module donnant accès au suivi et à la gestion des cookies
var logger = require('morgan'); // Module simplifiant le processus de consignation des requêtes HTTP et des erreurs
var cors = require('cors');

//import et connection MongoDb
var mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost:27017/projet3', 
{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Connexion à MongoDB réussie!"))
.catch(() => console.log("Echec de connexion à MongoDB"));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const succursalesRouter = require('./routes/succursales');
const studentsRouter = require('./routes/students');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), { index: "projet3.htm" }));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/succursales', succursalesRouter);
app.use('/students', studentsRouter);


module.exports = app;
