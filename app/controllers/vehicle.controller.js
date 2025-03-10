// src/components/vehicle/controllers/vehicle.controller.js

const vehicleService = require('../services/vehicle.service');
const CrudController = require('../core/controllers/crud.controller');

class VehicleController extends CrudController {
    constructor() {
        super(vehicleService);
    }

    // Créer un véhicule
    async create(req, res) {
        try {
            const vehicleData = req.body;
            const newVehicle = await vehicleService.create(vehicleData);
            return res.status(201).json(newVehicle);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Récupérer un véhicule par ID
    async getById(req, res) {
        try {
            const vehicle = await vehicleService.getVehicleById(req.params.id);
            if (!vehicle) {
                return res.status(404).json({ message: "Véhicule non trouvé" });
            }
            return res.status(200).json(vehicle);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Récupérer tous les véhicules d'un client
    async getByClientId(req, res) {
        try {
            const vehicles = await vehicleService.getVehiclesByClientId(req.params.clientId);
            return res.status(200).json(vehicles);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Mettre à jour un véhicule
    async update(req, res) {
        try {
            const vehicleData = req.body;
            const updatedVehicle = await vehicleService.update(req.params.id, vehicleData);
            if (!updatedVehicle) {
                return res.status(404).json({ message: "Véhicule non trouvé pour mise à jour" });
            }
            return res.status(200).json(updatedVehicle);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Supprimer un véhicule
    async delete(req, res) {
        try {
            const deletedVehicle = await vehicleService.delete(req.params.id);
            if (!deletedVehicle) {
                return res.status(404).json({ message: "Véhicule non trouvé pour suppression" });
            }
            return res.status(200).json({ message: "Véhicule supprimé avec succès" });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new VehicleController();
