const CrudController = require('../core/controllers/crud.controller');
const mechanicService = require('../services/mechanic.service');

class MechanicController extends CrudController {
    constructor() {
        super(mechanicService);
    }

    // Création d'un mécanicien
    async create(req, res) {
        try {
            const mechanicData = req.body;
            const newMechanic = await mechanicService.create(mechanicData);
            return res.status(201).json(newMechanic);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Récupérer un mécanicien par ID
    async getById(req, res) {
        try {
            const mechanic = await mechanicService.getById(req.params.id);
            if (!mechanic) {
                return res.status(404).json({ message: "Mécanicien non trouvé" });
            }
            return res.status(200).json(mechanic);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async getNbrMechanic(req, res) {
        try {
            const mechanic = await mechanicService.getNbrMechanics();
            if (!mechanic) {
                return res.status(404).json({ message: "Erreur lors de la prise des nombres des mechaniciens" });
            }
            return res.status(200).json({ nombre : mechanic });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Récupérer tous les mécaniciens
    async getAll(req, res) {
        try {
            const mechanics = await mechanicService.getAll();
            return res.status(200).json(mechanics);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Mise à jour d'un mécanicien
    async update(req, res) {
        try {
            const mechanicData = req.body;
            const updatedMechanic = await mechanicService.update(req.params.id, mechanicData);
            if (!updatedMechanic) {
                return res.status(404).json({ message: "Mécanicien non trouvé pour mise à jour" });
            }
            return res.status(200).json(updatedMechanic);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Suppression d'un mécanicien
    async delete(req, res) {
        try {
            const deletedMechanic = await mechanicService.delete(req.params.id);
            if (!deletedMechanic) {
                return res.status(404).json({ message: "Mécanicien non trouvé pour suppression" });
            }
            return res.status(200).json({ message: "Mécanicien supprimé avec succès" });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new MechanicController();