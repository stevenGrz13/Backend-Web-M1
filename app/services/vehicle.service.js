const Vehicle = require('../models/vehicle.model');
const CrudService = require('../core/services/crud.service')

class VehicleService extends CrudService{
    constructor() {
        super(Vehicle);
    }
}

module.exports = new VehicleService()
