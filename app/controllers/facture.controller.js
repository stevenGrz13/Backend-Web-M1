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
}

module.exports = new FactureController();
