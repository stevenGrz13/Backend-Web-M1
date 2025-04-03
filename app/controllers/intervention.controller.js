const interventionService = require("../services/intervention.service");
const CrudController = require("../core/controllers/crud.controller");
const ApiResponse = require("../core/response.model");

class InterventionController extends CrudController {
  constructor() {
    super(interventionService);
  }

  async getAllByMechanic(req, res){
    try {
      const { mechanicId } = req.params;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      const {data, pagination} = await interventionService.getAllByMechanic(mechanicId, {page, limit});

      ApiResponse.paginate(res, data, pagination, "Récupération des intervention par mécanicien")
    }catch (error) {

      new ApiResponse(
          500,
          null,
          "Erreur lors de la récupération des rendez-vous"
      ).send(res);
      throw error;
    }
  }

  async getLatestFive(req, res){
    try {

      const {data, pagination} = await interventionService.getLatestFive();

      new ApiResponse(200, data, "Récupération des 5 intervention ").send(res)
    }catch (error) {

      new ApiResponse(
          500,
          null,
          "Erreur lors de la récupération des rendez-vous"
      ).send(res);
      throw error;
    }
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

  async findNombreInterventionParEtat(req, res, next) {
    try {
      const interventions =
        await interventionService.findNombreInterventionParEtat();
      new ApiResponse(
        200,
        interventions,
        "Nombre des interventions par etat get avec succes"
      ).send(res);
    } catch (error) {
      new ApiResponse(
        500,
        null,
        "Erreur lors du nombre des interventions par etat"
      ).send(res);
    }
  }

  async findOngoingInterventions(req, res, next) {
    try {

      const interventions = await interventionService.findOngoingInterventions();

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
        req.params.interventionId
      );

      new ApiResponse(
        200,
        intervention,
        "Intervention finalisée et generation du facture avec succès "
      ).send(res);

    } catch (error) {

      new ApiResponse(
        500,
        null,
        "Erreur lors de la finalisation d'un intervention"
      ).send(res);
    }
  }

  async statChiffreAffaireByService(req, res, next) {
    try {

      const intervention = await interventionService.statChiffreAffaireByService(req.params.demande);

      new ApiResponse(
        200,
        intervention,
        "get statChiffreAffaireByService"
      ).send(res);

    } catch (error) {

      new ApiResponse(
        500,
        null,
        "Erreur lors du get statChiffreAffaireByService"
      ).send(res);

    }
  }

  async totalRevenueService(req, res, next) {
    try {
      const intervention = await interventionService.totalRevenuParService();

      new ApiResponse(
        200,
        intervention,
        "total revenue service"
      ).send(res);

    } catch (error) {

      new ApiResponse(
        500,
        null,
        "Erreur lors du total revenue service"
      ).send(res);

    }
  }

  async totalRevenueToday(req, res, next) {
    try {
      const intervention = await interventionService.totalRevenuToday();

      new ApiResponse(
        200,
        intervention,
        "total revenue today"
      ).send(res);

    } catch (error) {

      new ApiResponse(
        500,
        null,
        "Erreur lors du total revenue today"
      ).send(res);

    }
  }

  async getOngoingInterventionForDashboard(req, res, next) {
    try {
      const intervention = await interventionService.getOngoingInterventionForDashboard();
      new ApiResponse(
        200,
        intervention,
        "get intervention en cours pour le dashboard avec succes"
      ).send(res);
    } catch (error) {
      new ApiResponse(
        500,
        null,
        "Erreur lors du get intervention en cours pour le dashboard"
      ).send(res);
    }
  }


  async getDetails(req, res, next) {
    try {
      const {id} = req.params
      const intervention = await interventionService.getDetails(id);
      new ApiResponse(
          200,
          intervention,
          "details de l'intervention "
      ).send(res);
    } catch (error) {
      new ApiResponse(
          500,
          null,
          "Erreur lors du recuperation de l'intervention "
      ).send(res);
    }
  }

  async getLatestByVehicleId(req, res, next) {
    try {
      const {vehicleId} = req.params
      console.log("vehicles id === ", vehicleId)
      const intervention = await interventionService.getLatestInterventionByVehicleId(vehicleId);
      new ApiResponse(
          200,
          intervention,
          "details de l'intervention "
      ).send(res);
    } catch (error) {
      new ApiResponse(
          500,
          null,
          "Erreur lors du recuperation de l'intervention "
      ).send(res);
    }
  }

  async FinirService(req, res, next) {
    try {
      const { serviceId, interventionId } = req.body
      const intervention = await interventionService.FinirService(serviceId, interventionId);
      new ApiResponse(
          200,
          intervention,
          "Action réussi"
      ).send(res);
    } catch (error) {
      new ApiResponse(
          500,
          null,
          "Erreur lors du recuperation de l'intervention "
      ).send(res);
    }
  }

  ///////

  async AjouterPiece(req, res, next) {
    try {
      const { interventionId, pieceId, quantite } = req.body
      const intervention = await interventionService.AjouterPiece(interventionId, pieceId, quantite);
      new ApiResponse(
          200,
          intervention,
          "Action réussi rajout piece"
      ).send(res);
    } catch (error) {
      new ApiResponse(
          500,
          null,
          "Erreur lors du rajout de piece"
      ).send(res);
    }
  }

  async ApprouverPiece(req, res, next) {
    try {
      const { interventionId, pieceId } = req.body
      const intervention = await interventionService.ApprouverPiece(interventionId, pieceId);
      new ApiResponse(
          200,
          intervention,
          "Rajout piece acceptee"
      ).send(res);
    } catch (error) {
      new ApiResponse(
          500,
          null,
          "Erreur lors de l'approbation de rajout de piece"
      ).send(res);
    }
  }

  ///////

  async getFactures(req, res, next) {
    try {
      const intervention = await interventionService.getBlocAllFacture();
      new ApiResponse(
          200,
          intervention,
          "details de l'intervention "
      ).send(res);
    } catch (error) {
      new ApiResponse(
          500,
          null,
          "Erreur lors du recuperation de l'intervention "
      ).send(res);
    }
  }
}

module.exports = new InterventionController();
