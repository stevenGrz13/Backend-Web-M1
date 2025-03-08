const managerService = require('../services/manager.service');

const CrudController = require('../core/controllers/crud.controller');

class ManagerController extends CrudController {
    constructor() {
        super(managerService);
    }
}

module.exports = new ManagerController();
