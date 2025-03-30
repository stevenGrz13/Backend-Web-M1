const CrudController = require("../core/controllers/crud.controller");
const ApiResponse = require("../core/response.model");
const RendezVousService = require("../services/rendezvous.service");

class RendezVousController extends CrudController {
  constructor() {
    super(RendezVousService);
  }

  async genererRendezVousAvecSuggestion(req, res) {
    try {
      const rendezVous = await RendezVousService.genererRendezVousAvecSuggestion(req.body);
      new ApiResponse(
        200,
        rendezVous,
        "test ity"
      ).send(res);
    } catch (error) {
      new ApiResponse(
        500,
        null,
        "Erreur lors de la récupération du nombre des Rendez Vous"
      ).send(res);
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
}

module.exports = new RendezVousController();
