// src/components/mechanic/services/mechanic.service.js
const CrudService = require('../core/services/crud.service');
const Mechanic = require('./mechanic.model');

class MechanicService extends CrudService {
    constructor() {
        super(Mechanic);
    }
}

module.exports = new MechanicService();
