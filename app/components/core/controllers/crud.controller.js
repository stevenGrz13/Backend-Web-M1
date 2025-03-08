// src/components/core/controllers/crud.controller.js
const logger = require("../../../../utils/logger");

class CrudController {
    constructor(service) {
        this.service = service;
    }

    async create(req, res, next) {
        try {
            const document = await this.service.create(req.body);
            logger.info(`entité créé avec succès`);
            res.status(201).json(document);
        } catch (err) {
            next(err);
            logger.error(`Erreur lors du création : ${error.message}`);
            res.status(400).json({ message: error.message });
        }
    }

    async getById(req, res, next) {
        try {
            const document = await this.service.getById(req.params.id);
            if (!document) throw new Error('Document not found');
            res.status(200).json(document);
        } catch (err) {
            next(err);
        }
    }

    async getAll(req, res, next) {
        try {
            const documents = await this.service.getAll(req.query);
            res.status(200).json(documents);
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const document = await this.service.update(req.params.id, req.body);
            if (!document) throw new Error('Document not found');
            res.status(200).json(document);
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            const document = await this.service.delete(req.params.id);
            if (!document) throw new Error('Document not found');
            res.status(200).json({ message: 'Document deleted successfully' });
        } catch (err) {
            next(err);
            logger.error(`Erreur lors de la suppression de cette entité: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = CrudController;
