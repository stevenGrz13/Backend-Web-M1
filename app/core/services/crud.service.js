// src/components/core/services/crud.service.js

const logger = require("../../../utils/logger");
class CrudService {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const document = new this.model(data);
    logger.info(
      `Création du document avec les données...: ${JSON.stringify(data)}`
    );
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

  async getAllPaginate({ page = 1, limit = 10 }) {
    let dataResponse = {};
    logger.info(`Récupération de tous les elements...`);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model.find().skip(skip).limit(limit),
      this.model.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    dataResponse = {
      data,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNext,
        hasPrev,
        limit,
      },
    };

    return dataResponse;
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
