const Manager = require('../models/manager.model');
const CrudService = require('../core/services/crud.service');

class ManagerService extends CrudService {
    constructor() {
        super(Manager);
    }

    async create(managerData) {
        try {
            const manager = new Manager(managerData);
            return await manager.save();
        } catch (error) {
            throw new Error("Erreur lors de la création du manager: " + error.message);
        }
    }

    async getById(id) {
        try {
            return await Manager.findById(id);
        } catch (error) {
            throw new Error("Erreur lors de la récupération du manager: " + error.message);
        }
    }

    async update(id, managerData) {
        try {
            return await Manager.findByIdAndUpdate(id, managerData, { new: true });
        } catch (error) {
            throw new Error("Erreur lors de la mise à jour du manager: " + error.message);
        }
    }

    async delete(id) {
        try {
            return await Manager.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Erreur lors de la suppression du manager: " + error.message);
        }
    }
}

module.exports = new ManagerService();
