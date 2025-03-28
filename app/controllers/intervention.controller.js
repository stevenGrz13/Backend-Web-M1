const interventionService = require('../services/intervention.service');
const CrudController = require("../core/controllers/crud.controller");
const ApiResponse = require("../core/response.model");

class InterventionController extends CrudController {
  constructor() {
    super(interventionService);
  }

  async getNumbersOfInterventions(req, res, next) {
    try {
      const interventions = await interventionService.getNumberOfIntervention();
      new ApiResponse(200, interventions, "Nombre d'interventions récupéré avec succès").send(res);
    } catch (error) {
      next(error);
    }
  }

  async findOngoingInterventions(req, res, next) {
    try {
      const interventions = await interventionService.findOngoingInterventions();
      new ApiResponse(200, interventions, "Interventions en cours récupérées avec succès").send(res);
    } catch (error) {
      next(error);
    }
  }

  async updateServiceStatus(req, res, next) {
    try {
      const { interventionId, serviceId, status } = req.body;
      const intervention = await interventionService.updateServiceStatus(interventionId, serviceId, status);
      new ApiResponse(200, intervention, "Statut du service mis à jour avec succès").send(res);
    } catch (error) {
      next(error);
    }
  }

  async updatePieceQuantity(req, res, next) {
    try {
      const { interventionId, pieceId, quantity } = req.body;
      const intervention = await interventionService.updatePieceQuantity(interventionId, pieceId, quantity);
      new ApiResponse(200, intervention, "Quantité de la pièce mise à jour avec succès").send(res);
    } catch (error) {
      next(error);
    }
  }

  async finalizeIntervention(req, res, next) {
    try {
      const intervention = await interventionService.finalizeIntervention(req.params.id);
      new ApiResponse(200, intervention, "Intervention finalisée avec succès").send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InterventionController();