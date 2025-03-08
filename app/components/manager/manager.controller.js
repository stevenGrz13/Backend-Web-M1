const managerService = require('./manager.service');

const CrudController = require('../core/controllers/crud.controller');

class ManagerController extends CrudController {
    constructor() {
        super(managerService);
    }
}

module.exports = new ManagerController();
