// src/components/vehicle/controllers/vehicle.controller.js

const vehicleService = require("../services/vehicle.service");
const CrudController = require("../core/controllers/crud.controller");
const ApiResponse = require("../core/response.model");

class VehicleController extends CrudController {
  constructor() {
    super(vehicleService);
  }

  async getByClientId(req, res) {
    try {
      const vehicles = await vehicleService.getVehiclesByClientId(
        req.params.clientId
      );
      new ApiResponse(200, vehicles, "Vehicles got successfully").send(res);
    } catch (error) {
      new ApiResponse(500, null, "Error during fecthing vehicle by client Id").send(res);
    }
  }
}

module.exports = new VehicleController();
