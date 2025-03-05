const mongoose = require('mongoose');

const MecanicienSchema = new mongoose.Schema({
 nom: { type: String, required: true },
 prenom: { type: String, required: true },
 adresse: { type: String, required: true },
 courriel: { type: String, required: true },
 motdepasse: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Mecanicien', MecanicienSchema);