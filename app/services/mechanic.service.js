const CrudService = require('../core/services/crud.service');
const Mechanic = require('../models/mechanic.model');

class MechanicService extends CrudService {
    constructor() {
        super(Mechanic);
    }

    // Création d'un mécanicien
    async create(mechanicData) {
        try {
            const mechanic = new Mechanic(mechanicData);
            return await mechanic.save();
        } catch (error) {
            throw new Error("Erreur lors de la création du mécanicien: " + error.message);
        }
    }

    // Récupérer un mécanicien par ID
    async getById(id) {
        try {
            return await Mechanic.findById(id);
        } catch (error) {
            throw new Error("Erreur lors de la récupération du mécanicien: " + error.message);
        }
    }

    // Récupérer tous les mécaniciens
    async getAll(query = {}) {
        try {
            return await Mechanic.find(query);
        } catch (error) {
            throw new Error("Erreur lors de la récupération des mécaniciens: " + error.message);
        }
    }

    // Mise à jour d'un mécanicien
    async update(id, mechanicData) {
        try {
            return await Mechanic.findByIdAndUpdate(id, mechanicData, { new: true });
        } catch (error) {
            throw new Error("Erreur lors de la mise à jour du mécanicien: " + error.message);
        }
    }

    // Suppression d'un mécanicien
    async delete(id) {
        try {
            return await Mechanic.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Erreur lors de la suppression du mécanicien: " + error.message);
        }
    }
}

module.exports = new MechanicService();
