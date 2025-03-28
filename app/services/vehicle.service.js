// src/components/vehicle/services/vehicle.service.js

const CrudService = require('../core/services/crud.service');
const Vehicle = require('../models/vehicle.model');

class VehicleService extends CrudService {
    constructor() {
        super(Vehicle);
    }

    async getVehiclesByClientId(clientId) {
        try {
            return await Vehicle.find({ clientId }).exec();
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des véhicules: ${error.message}`);
        }
    }
}

module.exports = new VehicleService();
