// src/components/vehicle/services/vehicle.service.js

const CrudService = require('../core/services/crud.service');
const Vehicle = require('../models/vehicle.model');

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
}

module.exports = new VehicleService();
