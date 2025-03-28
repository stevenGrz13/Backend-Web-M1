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
}

module.exports = new PieceService();
