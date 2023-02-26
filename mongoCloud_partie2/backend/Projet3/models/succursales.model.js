const { default: mongoose } = require("mongoose");

const succursalesSchema = mongoose.Schema({
    Ville: String,
    Budget: String,
    Matricule: String
}, { collection: "succursales", versionKey: false })

module.exports = mongoose.model("Succursales", succursalesSchema)