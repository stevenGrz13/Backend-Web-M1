// src/components/core/controllers/crud.controller.js
const logger = require("../../../utils/logger");
const ApiResponse = require("../../core/response.model");

class CrudController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res, next) {
    try {
      const document = await this.service.create(req.body); // Il dit qu'il y a une erreur ici
      logger.info(`entité créé avec succès`);
      new ApiResponse(201, document, "Document created successfully").send(res);
    } catch (err) {
      next(err);
      new ApiResponse(400, null, "Error during creation").send(res);
    }
  }

  async getById(req, res, next) {
    try {
      const document = await this.service.getById(req.params.id);
      if (!document) throw new Error("Document not found");
      new ApiResponse(201, document, "Get Document successfully").send(res);
    } catch (err) {
      next(err);
      new ApiResponse(500, null, "Error during Get Document").send(res);
    }
  }

  async getAll(req, res, next) {
    try {
      const documents = await this.service.getAll(req.query);
      new ApiResponse(200, documents, "Documents retrieved successfully").send(
        res
      );
    } catch (err) {
      next(err);
      new ApiResponse(500, null, "Error during get all").send(res);
    }
  }

  async getAllPaginate(req, res, next) {
    try {

      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      const { data, pagination } = await this.service.getAllPaginate({
        page,
        limit,
      });
      ApiResponse.paginate(
        res,
        data,
        pagination,
        "Documents retrieved successfully"
      );
    } catch (err) {
      next(err);
      new ApiResponse(500, null, "Error during get All Paginate").send(res);
    }
  }

  async update(req, res, next) {
    try {
      const document = await this.service.update(req.params.id, req.body);
      if (!document) throw new Error("Document not found");
      new ApiResponse(200, document, "Document updated successfully").send(res);
    } catch (err) {
      next(err);
      new ApiResponse(500, null, "Error during Update Document").send(res);
    }
  }

  async delete(req, res, next) {
    try {
      const document = await this.service.delete(req.params.id);
      if (!document) throw new Error("Document not found");
      new ApiResponse(201, document, "Document deleted successfully").send(res);
    } catch (err) {
      next(err);
      new ApiResponse(500, null, "Error during deleting document").send(res);
    }
  }
}

module.exports = CrudController;
