// src/components/user/services/user.service.js
const CrudService = require('../core/services/crud.service');
const User = require('./user.model');

class UserService extends CrudService {
    constructor() {
        super(User);
    }

    async getByRole(role) {
        return await this.model.find({ role });
    }
}

module.exports = new UserService();
