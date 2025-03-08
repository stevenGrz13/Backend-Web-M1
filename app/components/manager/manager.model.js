const mongoose = require('mongoose');

const ManagerSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    adresse: { type: String, required: true },
    courriel: { type: String, required: true },
    motdepasse: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Manager', ManagerSchema);
