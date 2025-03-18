const pieceService = require('../services/piece.service');
const CrudController = require("../core/controllers/crud.controller");

class PieceController extends CrudController {
    constructor() {
        super(pieceService);
    }

    async findPieceRupture(req, res) {
        try {
            const piece = await pieceService.findEmptyPiece();
            res.status(201).json(piece);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la recherche des pieces en rupture de stock", error: error.message });
        }
    }

    async createPiece(req, res) {
        try {
            const piece = await pieceService.createPiece(req.body);
            res.status(201).json(piece);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création de la pièce", error: error.message });
        }
    }

    async getPieces(req, res) {
        try {
            const pieces = await pieceService.getPieces();
            res.status(200).json(pieces);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des pièces", error: error.message });
        }
    }

    async updatePiece(req, res) {
        try {
            const updatedPiece = await pieceService.updatePiece(req.params.id, req.body);
            if (!updatedPiece) {
                return res.status(404).json({ message: "Pièce non trouvée" });
            }
            res.status(200).json(updatedPiece);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour de la pièce", error: error.message });
        }
    }

    async deletePiece(req, res) {
        try {
            const deletedPiece = await pieceService.deletePiece(req.params.id);
            if (!deletedPiece) {
                return res.status(404).json({ message: "Pièce non trouvée" });
            }
            res.status(200).json({ message: "Pièce supprimée avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression de la pièce", error: error.message });
        }
    }
}

module.exports = new PieceController();
