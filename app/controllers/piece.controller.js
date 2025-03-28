const pieceService = require("../services/piece.service");
const CrudController = require("../core/controllers/crud.controller");
const ApiResponse = require("../core/response.model");

class PieceController extends CrudController {
  constructor() {
    super(pieceService);
  }

  async findPieceRupture(req, res) {
    try {
      const piece = await pieceService.findEmptyPiece();
      new ApiResponse(
        200,
        piece,
        "Recuperation des pieces en rupture avec succes"
      ).send(res);
    } catch (error) {
      new ApiResponse(
        500,
        null,
        "Erreur lors de la récupération des pieces en rupture"
      ).send(res);
    }
  }
}

module.exports = new PieceController();
