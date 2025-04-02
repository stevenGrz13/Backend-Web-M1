const factureService = require("../services/facture.service");
const CrudController = require("../core/controllers/crud.controller");
const ApiResponse = require("../core/response.model");
class FactureController extends CrudController {
  constructor() {
    super(factureService);
  }

  async getFactureByClientId(req, res, next) {
    try {
      const facture = await factureService.getBlocFactureByClientId(
        req.params.clientId
      );
      new ApiResponse(
        200,
        facture.formattedFactures,
        "succes getFactureByClientId"
      ).send(res);
    } catch (error) {
      new ApiResponse(500, null, "Erreur lors du getFactureByClientId").send(
        res
      );
    }
  }

  async getDetails(req, res){
    try{
      const { id } = req.params;
      const data = await factureService.getDetailsById(id);

      new ApiResponse(200, data, "detail du facture est un success").send(res)
    }catch (error){
      new ApiResponse(500, null, "erreur lors du recuperation du facture").send(res)
    }
  }

  async getAllByClientId(req, res, next) {
    try {
      const { clientId } = req.params;

      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      const { data, pagination } = await factureService.getAllByClient(
        clientId,
        { page, limit }
      );

      ApiResponse.paginate(
        res,
        data,
        pagination,
        "Documents retrieved successfully"
      );
    } catch (error) {
      new ApiResponse(500, null, "Erreur lors du getFactureByClientId").send(
        res
      );
    }
  }

  async payerFacture(req, res, next) {
    try {
      const { factureId } = req.params;

      const facture = await factureService.payerFacture(factureId);

      new ApiResponse(200, facture, "succes paiement facture").send(res);
    } catch (error) {
      new ApiResponse(500, null, "Erreur lors du paiement du facture").send(
        res
      );
    }
  }
}

module.exports = new FactureController();
