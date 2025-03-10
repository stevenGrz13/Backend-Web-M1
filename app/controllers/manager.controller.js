const managerService = require('../services/manager.service');
const CrudController = require("../core/controllers/crud.controller");

class ManagerController extends CrudController {
    constructor() {
        super(managerService);
    }

    async create(req, res) {
        try {
            const manager = await managerService.create(req.body);
            res.status(201).json(manager);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création du manager", error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const manager = await managerService.getById(req.params.id);
            if (!manager) {
                return res.status(404).json({ message: "Manager non trouvé" });
            }
            res.status(200).json(manager);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération du manager", error: error.message });
        }
    }

    async update(req, res) {
        try {
            const updatedManager = await managerService.update(req.params.id, req.body);
            if (!updatedManager) {
                return res.status(404).json({ message: "Manager non trouvé" });
            }
            res.status(200).json(updatedManager);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour du manager", error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const deletedManager = await managerService.delete(req.params.id);
            if (!deletedManager) {
                return res.status(404).json({ message: "Manager non trouvé" });
            }
            res.status(200).json({ message: "Manager supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression du manager", error: error.message });
        }
    }
}

module.exports = new ManagerController();
