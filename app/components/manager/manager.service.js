const Manager = require('./manager.model');
const CrudService = require('../core/services/crud.service')

class ManagerService extends CrudService{
    constructor() {
        super(Manager);
    }
}

module.exports = new ManagerService()
