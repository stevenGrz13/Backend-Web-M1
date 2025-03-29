const interventionService = require("../services/intervention.service");
const CrudController = require("../core/controllers/crud.controller");
const ApiResponse = require("../core/response.model");

class InterventionController extends CrudController {
  constructor() {
    super(interventionService);
  }

  async getInterventionByClientId(req, res, next) {
    try {
      const interventions = await interventionService.findInterventionByClientId(req.params.ClientId);
      new ApiResponse(
        200,
        interventions,
        "Recuperation des Interventions par client ID avec succes"
      ).send(res);
    } catch (error) {
      new ApiResponse(
        500,
        null,
        "Erreur lors de la Recuperation des Interventions par client ID"
      ).send(res);
    }
  }

  async getNumbersOfInterventions(req, res, next) {
    try {
      const interventions = await interventionService.getNumberOfIntervention();
      new ApiResponse(
        200,
        interventions,
        "Nombre d'interventions récupéré avec succès"
      ).send(res);
    } catch (error) {
      new ApiResponse(
        500,
        null,
        "Erreur lors de la récupération du nombre des interventions"
      ).send(res);
    }
  }

  async findOngoingInterventions(req, res, next) {
    try {
      const interventions =
        await interventionService.findOngoingInterventions();
      new ApiResponse(
        200,
        interventions,
        "Interventions en cours récupérées avec succès"
      ).send(res);
    } catch (error) {
      new ApiResponse(
        500,
        null,
        "Erreur lors de la récupération du nombre des interventions en cours"
      ).send(res);
    }
  }

  async updateServiceStatus(req, res, next) {
    try {
      const { interventionId, serviceId, status } = req.body;
      const intervention = await interventionService.updateServiceStatus(
        interventionId,
        serviceId,
        status
      );
      new ApiResponse(
        200,
        intervention,
        "Statut du service mis à jour avec succès"
      ).send(res);
    } catch (error) {
      new ApiResponse(
        500,
        null,
        "Erreur lors de la mise a jour du Service dans l'intervention"
      ).send(res);
    }
  }

  async updatePieceQuantity(req, res, next) {
    try {
      const { interventionId, pieceId, quantity } = req.body;
      const intervention = await interventionService.updatePieceQuantity(
        interventionId,
        pieceId,
        quantity
      );
      new ApiResponse(
        200,
        intervention,
        "Quantité de la pièce mise à jour avec succès"
      ).send(res);
    } catch (error) {
      new ApiResponse(
        500,
        null,
        "Erreur lors de la modification du nombre de piece"
      ).send(res);
    }
  }

  async finalizeIntervention(req, res, next) {
    try {
      const intervention = await interventionService.finalizeIntervention(
        req.params.id
      );
      new ApiResponse(
        200,
        intervention,
        "Intervention finalisée avec succès"
      ).send(res);
    } catch (error) {
      new ApiResponse(
        500,
        null,
        "Erreur lors de la finalisation d'un intervention"
      ).send(res);
    }
  }
}

module.exports = new InterventionController();
