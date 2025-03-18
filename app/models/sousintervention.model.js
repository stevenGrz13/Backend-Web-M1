const mongoose = require('mongoose');

const sousInterventionSchema = new mongoose.Schema({
    interventionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Intervention', required: true }, // Référence à l'intervention parent
    description: { type: String, required: true },
    dureeEstimee: { type: Number, required: true },
    statut: { type: String, enum: ['En attente', 'En cours', 'Terminée'], default: 'En attente' }
}, { timestamps: true });

module.exports = mongoose.model('SousIntervention', sousInterventionSchema);