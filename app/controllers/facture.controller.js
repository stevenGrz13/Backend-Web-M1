const factureService = require("../services/facture.service");
const CrudController = require("../core/controllers/crud.controller");
const ApiResponse = require("../core/response.model");
class FactureController extends CrudController {
  constructor() {
    super(factureService);
  }

  async getFactureByClientId(req, res, next) {
    try {
      const facture =
        await factureService.getBlocFactureByClientId(
          req.params.clientId
        );
      new ApiResponse(
        200,
        facture.formattedFactures,
        "succes getFactureByClientId"
      ).send(res);
    } catch (error) {
      new ApiResponse(
        500,
        null,
        "Erreur lors du getFactureByClientId"
      ).send(res);
    }
  }

  async getAllByClientId(req, res, next) {
    try {
      const {clientId} = req.params

      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      const { data, pagination } =
          await factureService.getAllByClient(clientId, {page, limit});

      ApiResponse.paginate(res, data, pagination, "Documents retrieved successfully");


    } catch (error) {
      new ApiResponse(
          500,
          null,
          "Erreur lors du getFactureByClientId"
      ).send(res);
    }
  }
}

module.exports = new FactureController();
