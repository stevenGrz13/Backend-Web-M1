const serviceService = require('../services/services.service');
const CrudController = require("../core/controllers/crud.controller");

class ServiceController extends CrudController {
    constructor() {
        super(serviceService);
    }
}

module.exports = new ServiceController();
