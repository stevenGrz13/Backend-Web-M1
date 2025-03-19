// src/components/vehicle/models/vehicle.model.js
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    userOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    marque: { type: String, required: true },
    model: { type: String, required: true },
    annee: { type: Number, required: true },
    kilometrage: { type: Number, required: true },
    immatriculation: { type: String, required: true },
    status: { type: String, enum: ['non operationnel', 'opperationnel'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
