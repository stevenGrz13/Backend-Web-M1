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

  async updateQuantitiesBulk(req, res){
    try {
      const { updates } = req.body;


      // Exécuter les opérations en lot
      const result = await pieceService.updateQuantitiesBulk(updates);

      new ApiResponse(200, result.modifiedCount, "Mises à jour effectuées avec succès")
          .send(res)

      // res.status(200).json({
      //   message: "Mises à jour effectuées avec succès",
      //   modifiedCount: result.modifiedCount
      // });
    } catch (error) {
      console.error("Erreur lors de la mise à jour par lot:", error);

      new ApiResponse(500, null, "Erreur serveur").send(res)
      // res.status(500).json({
      //   message: "Erreur serveur",
      //   error: error.message
      // });
    }
  }
}

module.exports = new PieceController();
