// src/components/vehicle/models/vehicle.model.js
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    mileage: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
