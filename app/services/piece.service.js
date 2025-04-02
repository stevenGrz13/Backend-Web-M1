const Piece = require("../models/piece.model");
const CrudService = require("../core/services/crud.service");

class PieceService extends CrudService {
  constructor() {
    super(Piece);
  }

  async findEmptyPiece() {
    const liste = await Piece.find({ quantite: 0 });
    return {
      liste: liste,
      nombre: liste.length,
    };
  }

  async updateQuantitiesBulk(pieces){
    if (!pieces || !Array.isArray(pieces)) {
      throw new Error("Le format des données est invalide")
    }

    // Préparer les opérations de mise à jour
    const bulkOps = pieces.map(update => ({
      updateOne: {
        filter: { _id: update.pieceId },
        update: { $set: { quantite: update.newQuantity } }
      }
    }));

    // Exécuter les opérations en lot
    const result = await Piece.bulkWrite(bulkOps);

    return result;
  }
}

module.exports = new PieceService();
