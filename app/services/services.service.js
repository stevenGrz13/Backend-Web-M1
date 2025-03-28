const Service = require("../models/service.model");
const CrudService = require("../core/services/crud.service");

class ServiceService extends CrudService {
  constructor() {
    super(Service);
  }
}

module.exports = new ServiceService();
