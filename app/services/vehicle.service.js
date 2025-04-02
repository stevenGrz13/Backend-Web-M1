// src/components/vehicle/services/vehicle.service.js

const CrudService = require('../core/services/crud.service');
const Vehicle = require('../models/vehicle.model');
const RendezVous = require('../models/rendezvous.model');

const { ObjectId } = require('mongoose').Types;

class VehicleService extends CrudService {
    constructor() {
        super(Vehicle);
    }

    async getVehiclesByClientId(clientId, {page = 1, limit = 10}) {
        try {

            let dataResponse = {};

            const skip = (page - 1) * limit;

            const [data, total] = await Promise.all([
                Vehicle.find({userId: clientId}).skip(skip).limit(limit),
                Vehicle.countDocuments({userId: clientId}),
            ]);


            const totalPages = Math.ceil(total / limit);
            const hasNext = page < totalPages;
            const hasPrev = page > 1;

            dataResponse = {
                data,
                pagination: {
                    total,
                    totalPages,
                    currentPage: page,
                    hasNext,
                    hasPrev,
                    limit,
                },
            };

            return dataResponse;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des véhicules: ${error.message}`);
        }
    }

    async getVehiculeNotInIntervention(clientId, options = { page: 1, limit: 10 }) {
        try {
            const { page, limit } = options;
    
            const vehiclesResponse = await this.getVehiclesByClientId(clientId, { page, limit });
            const vehicles = vehiclesResponse.data;
    
            const listeIntervention = await RendezVous.find({ statut: 'confirmé' });
    
            const vehiclesNotInIntervention = vehicles.filter(
                (v) => !listeIntervention.some((intervention) => intervention.vehiculeId.equals(v._id))
            );
    
            const total = await Vehicle.countDocuments({ userId: clientId });
    
            const totalPages = Math.ceil(total / limit);
            const hasNext = page < totalPages;
            const hasPrev = page > 1;
    
            return {
                data: vehiclesNotInIntervention,
                pagination: {
                    total,
                    totalPages,
                    currentPage: page,
                    hasNext,
                    hasPrev,
                    limit,
                },
            };
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des véhicules non en intervention: ${error.message}`);
        }
    }
    
}

module.exports = new VehicleService();
