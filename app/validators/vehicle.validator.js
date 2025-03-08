// src/app/validators/vehicle.validator.js
const Joi = require('joi');

const createVehicleSchema = Joi.object({
    clientId: Joi.string().required(),
    brand: Joi.string().required(),
    model: Joi.string().required(),
    year: Joi.number().required(),
    mileage: Joi.number().required(),
});

const updateVehicleSchema = Joi.object({
    brand: Joi.string().optional(),
    model: Joi.string().optional(),
    year: Joi.number().optional(),
    mileage: Joi.number().optional(),
});

module.exports = {
    createVehicleSchema,
    updateVehicleSchema,
};
