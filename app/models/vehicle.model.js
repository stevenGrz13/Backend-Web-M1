// src/components/vehicle/models/vehicle.model.js
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    marque: { type: String, required: true },
    model: { type: String, required: true },
    annee: { type: Number, required: true },
    kilometrage: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
