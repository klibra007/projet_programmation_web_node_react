const { default: mongoose } = require("mongoose");

const studentsSchema = mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    matricule: String,
    firstname: String,
    lastname: String,
    email: {
        type: String,
        required: 'Entrer votre mail',
    },
    password: String
}, { collection: "students", versionKey: false })

module.exports = mongoose.model("Student", studentsSchema)