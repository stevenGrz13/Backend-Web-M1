const CrudController = require("../core/controllers/crud.controller");
const ApiResponse = require("../core/response.model");
const RendezVousService = require("../services/rendezvous.service");

class RendezVousController extends CrudController {
  constructor() {
    super(RendezVousService);
  }

  async getInfosByClient(req, res) {

    try {
      const { clientId } = req.params;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      const {data, pagination} = await RendezVousService.getInfosByClient(clientId, {page, limit});
      ApiResponse.paginate(res, data, pagination, "Récupération des rendez-vous détaillés")
    } catch (error) {

      new ApiResponse(
          500,
          null,
          "Erreur lors de la récupération des rendez-vous"
      ).send(res);
      throw error;
    }
  }

  async getInfosByMechanic(req, res) {

    try {
      // console.log('')
      const { mechanicId } = req.params;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      const {data, pagination} = await RendezVousService.getInfosByMechanic(mechanicId, {page, limit});
      ApiResponse.paginate(res, data, pagination, "Récupération des rendez-vous détaillés par mécanicien")
    } catch (error) {

      new ApiResponse(
          500,
          null,
          "Erreur lors de la récupération des rendez-vous"
      ).send(res);
      throw error;
    }
  }

  async getInfos(req, res) {
    try {
      // console.log('')
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      const {data, pagination} = await RendezVousService.getInfos({page, limit});
      ApiResponse.paginate(res, data, pagination, "Récupération des rendez-vous détaillés")
    } catch (error) {

      new ApiResponse(
          500,
          null,
          "Erreur lors de la récupération des rendez-vous"
      ).send(res);
      throw error;
    }
  }

  async genererRendezVousAvecSuggestion(req, res) {
    try {
      const rendezVous = await RendezVousService.genererRendezVousAvecSuggestion(req.body);
      new ApiResponse(
        200,
        rendezVous,
        "Succes pour la creation de RendezVous"
      ).send(res);
    } catch (error) {
      new ApiResponse(
        500,
        null,
        "Erreur lors de la creation du rendezVous"
      ).send(res);

      throw error;
    }
  }

  async getNombreRdv(req, res) {
    try {
      const rendezVous = await RendezVousService.getAll();
      new ApiResponse(
        200,
        rendezVous.length,
        "Recuperation du nombre de RDV avec succes"
      ).send(res);
    } catch (error) {
      new ApiResponse(
        500,
        null,
        "Erreur lors de la récupération du nombre des Rendez Vous"
      ).send(res);
    }
  }

  async getRendezVousParClient(req, res) {
    try {
      const { clientId } = req.params;
      const rendezVous = await RendezVousService.getRendezVousParClient(
        clientId
      );
      new ApiResponse(200, rendezVous, "Recuperation des RDV par client").send(
        res
      );
    } catch (error) {
      new ApiResponse(
        500,
        null,
        "Erreur lors de la récupération des Rendez Vous par Client"
      ).send(res);
    }
  }

  async getRendezVousParMecanicien(req, res) {
    try {
      const { mechanicienId } = req.params;
      const rendezVous = await RendezVousService.getRendezVousParMecanicien(
        mechanicienId
      );
      new ApiResponse(
        200,
        rendezVous,
        "Recuperation des rendez vous par mecanicien"
      ).send(res);
    } catch (error) {
      new ApiResponse(
        500,
        null,
        "Erreur lors de la récupération des Rendez Vous par Client"
      ).send(res);
    }
  }

  async annulerRendezVous(req, res) {
    try {
      const { rendezVousId } = req.params;
      const rendezVous = await RendezVousService.annulerRendezVous(
        rendezVousId
      );
      new ApiResponse(200, rendezVous, "Annulation RDV").send(res);
    } catch (error) {
      new ApiResponse(
        500,
        null,
        "Erreur lors de l'annulation d'un Rendez Vous"
      ).send(res);
    }
  }

  async confirmerRendezVous(req, res) {
    try {
      const { rendezVousId } = req.params;
      const rendezVous = await RendezVousService.confirmerRendezVous(
        rendezVousId
      );
      new ApiResponse(200, rendezVous, "Confirmation RDV").send(res);
    } catch (error) {
      new ApiResponse(
        500,
        null,
        "Erreur lors de l'annulation d'un Rendez Vous"
      ).send(res);
    }
  }

  async getPlanning(req, res) {
    try {
      const rendezVous = await RendezVousService.fetchPlannings();
      new ApiResponse(200, rendezVous, "Get planning avec success").send(res);
    } catch (error) {
      new ApiResponse(
        500,
        null,
        "Erreur lors du get planning"
      ).send(res);
    }
  }

  async getDetail(req, res) {
    try {
      const rendezVous = await RendezVousService.getDetail(req.params.rendezvousId);
      new ApiResponse(200, rendezVous, "Get Detail avec success").send(res);
    } catch (error) {
      new ApiResponse(
        500,
        null,
        "Erreur lors du get Detail"
      ).send(res);
    }
  }

}

module.exports = new RendezVousController();
