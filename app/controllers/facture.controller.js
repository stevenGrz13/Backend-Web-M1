const factureService = require('../services/facture.service');
const CrudController = require("../core/controllers/crud.controller");

class FactureController extends CrudController {
    constructor() {
        super(factureService);
    }
}

module.exports = new FactureController();