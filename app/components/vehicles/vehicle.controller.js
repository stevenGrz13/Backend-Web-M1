const vehicleService = require('./vehicle.service');

const CrudController = require('../core/controllers/crud.controller');

class VehicleController extends CrudController {
    constructor() {
        super(vehicleService);
    }
}

module.exports = new VehicleController();
