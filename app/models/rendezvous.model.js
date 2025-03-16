const mongoose = require('mongoose');

const RendezVousSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, // Relation avec Client
    date: { type: Date, required: true },
    heure: { type: String, required: true }, // Ex: "14:30"
    description: { type: String },
    idVehicule: { type: String },
    idMechanicien: { type: mongoose.Schema.Types.ObjectId, ref: 'Mechanic' },
    statut: { type: String, enum: ['en attente', 'confirmé', 'annulé'], default: 'en attente' }
}, { timestamps: true });

module.exports = mongoose.model('RendezVous', RendezVousSchema);
