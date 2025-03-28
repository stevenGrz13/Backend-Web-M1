const CrudService = require('../core/services/crud.service');
const Facture = require('../models/facture.model');

class FactureService extends CrudService{
  constructor(){
    super(Facture);
  }
}

module.exports = new FactureService();