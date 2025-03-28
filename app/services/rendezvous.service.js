const RendezVous = require("../models/rendezvous.model");
const CrudService = require("../core/services/crud.service");
class RendezVousService extends CrudService {
  constructor() {
    super(RendezVous);
  }

  async getRendezVousParClient(clientId) {
    return await RendezVous.find({ userClientId: clientId }).populate(
      "userClientId",
      "nom prenom courriel"
    );
  }

  async getRendezVousParMecanicien(mecanicienId) {
    const value = await RendezVous.find({ userMecanicientId: mecanicienId }).populate(
      "userMecanicientId",
      "nom prenom courriel"
    );
    return value;
  }

  async annulerRendezVous(rendezVousId) {
    return await RendezVous.findByIdAndUpdate(
      rendezVousId,
      { statut: "annulé" },
      { new: true }
    );
  }
}

module.exports = new RendezVousService();
