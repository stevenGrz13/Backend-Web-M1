// src/components/core/services/crud.service.js

const logger = require("../../../../utils/logger");
class CrudService {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        const document = new this.model(data);
        logger.info(`Création du document avec les données...: ${JSON.stringify(data)}`);
        await document.save();
        return document;
    }

    async getById(id) {
        logger.info(`Récupération du document avec ID...: ${id}`);
        return await this.model.findById(id);
    }

    async getAll(query = {}) {
        logger.info(`Récupération de tous les elements...`);
        return await this.model.find(query);
    }

    async update(id, data) {
        logger.info(`Mise à jour de l'élément avec ID...: ${id}`);
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        logger.info(`Suppression de l'article avec ID...: ${id}...`);
        return await this.model.findByIdAndDelete(id);
    }
}

module.exports = CrudService;
