// src/components/vehicle/services/vehicle.service.js

const CrudService = require('../core/services/crud.service');
const Vehicle = require('../models/vehicle.model');

class VehicleService extends CrudService {
    constructor() {
        super(Vehicle);
    }

    // Fonction supplémentaire pour récupérer tous les véhicules d'un client
    async getVehiclesByClientId(clientId) {
        try {
            return await Vehicle.find({ clientId }).exec();
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des véhicules: ${error.message}`);
        }
    }

    // Fonction supplémentaire pour récupérer un véhicule par son ID
    async getVehicleById(vehicleId) {
        try {
            return await Vehicle.findById(vehicleId).exec();
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du véhicule: ${error.message}`);
        }
    }

    // Utilisation du CRUD de base (création, mise à jour, suppression)
    async create(vehicleData) {
        try {
            const vehicle = new Vehicle(vehicleData);
            return await vehicle.save();
        } catch (error) {
            throw new Error(`Erreur lors de la création du véhicule: ${error.message}`);
        }
    }

    async getAll() {
        try {
            return await Vehicle.find().exec();
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des véhicules: ${error.message}`);
        }
    }

    async update(vehicleId, vehicleData) {
        try {
            const updatedVehicle = await Vehicle.findByIdAndUpdate(vehicleId, vehicleData, { new: true }).exec();
            return updatedVehicle;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du véhicule: ${error.message}`);
        }
    }

    async delete(vehicleId) {
        try {
            const deletedVehicle = await Vehicle.findByIdAndDelete(vehicleId).exec();
            return deletedVehicle;
        } catch (error) {
            throw new Error(`Erreur lors de la suppression du véhicule: ${error.message}`);
        }
    }
}

module.exports = new VehicleService();
