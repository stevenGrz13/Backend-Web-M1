const clientService = require('../services/client.service');
const CrudController = require("../core/controllers/crud.controller");

class ClientController extends CrudController{

    constructor() {
        super(clientService);
    }

}

module.exports = new ClientController()
