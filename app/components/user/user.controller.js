// src/components/user/controllers/user.controller.js

const CrudController = require('../core/controllers/crud.controller');
const userService = require('./user.service');

class UserController extends CrudController {
    constructor() {
        super(userService);
    }
}

module.exports = new UserController();
