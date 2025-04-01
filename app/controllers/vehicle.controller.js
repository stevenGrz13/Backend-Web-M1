// src/components/vehicle/controllers/vehicle.controller.js

const vehicleService = require("../services/vehicle.service");
const CrudController = require("../core/controllers/crud.controller");
const ApiResponse = require("../core/response.model");

class VehicleController extends CrudController {
  constructor() {
    super(vehicleService);
  }

  async getByClientId(req, res) {
    console.log("salut")
    try {
      const { clientId } = req.params;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      // const { page = 1, limit = 10 } = req.query;

      const {data, pagination} = await vehicleService.getVehiclesByClientId(
          clientId,
          {page, limit}
      );

      ApiResponse.paginate(res, data, pagination, "Vehicles got successfully")
    } catch (error) {
      console.error("Error during fetching vehicle by client Id:", error);
      new ApiResponse(500, null, "Error during fetching vehicle by client Id").send(res);
    }
  }
}

module.exports = new VehicleController();
