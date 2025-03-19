const factureService = require('../services/facture.service');
const CrudController = require("../core/controllers/crud.controller");

class FactureController extends CrudController {
    constructor() {
        super(factureService);
    }

    async findFactureRupture(req, res) {
        try {
            const facture = await factureService.findEmptyFacture();
            res.status(201).json(facture);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la recherche des factures en rupture de stock", error: error.message });
        }
    }

    async createFacture(req, res) {
        try {
            const facture = await factureService.createFacture(req.body);
            res.status(201).json(facture);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création de la facture", error: error.message });
        }
    }

    async getFactures(req, res) {
        try {
            const factures = await factureService.getFactures();
            res.status(200).json(factures);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des factures", error: error.message });
        }
    }

    async updateFacture(req, res) {
        try {
            const updatedFacture = await factureService.updateFacture(req.params.id, req.body);
            if (!updatedFacture) {
                return res.status(404).json({ message: "Facture non trouvée" });
            }
            res.status(200).json(updatedFacture);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour de la facture", error: error.message });
        }
    }

    async deleteFacture(req, res) {
        try {
            const deletedFacture = await factureService.deleteFacture(req.params.id);
            if (!deletedFacture) {
                return res.status(404).json({ message: "Facture non trouvée" });
            }
            res.status(200).json({ message: "Facture supprimée avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression de la facture", error: error.message });
        }
    }
}

module.exports = new FactureController();