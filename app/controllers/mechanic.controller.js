// src/components/mechanic/mechanic.controller.js

const CrudController = require('../core/controllers/crud.controller');
const mechanicService = require('../services/mechanic.service');

class MechanicController extends CrudController {
    constructor() {
        super(mechanicService);
    }
}

module.exports = new MechanicController();
