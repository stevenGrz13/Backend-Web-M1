const RendezVous = require("../models/rendezvous.model");
const CrudService = require("../core/services/crud.service");
const Intervention = require("../models/intervention.model");
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

  async confirmerRendezVous(rendezVousId) {
    const confirmationRendezvous = await RendezVous.findByIdAndUpdate(
      rendezVousId,
      { statut: "confirmé" },
      { new: true }
    ).populate("services.serviceId").populate("pieces.piece");

    if (!confirmationRendezvous) {
      throw new Error("Rendez-vous non trouvé");
    }

    const intervention = new Intervention({
      rendezVousId,
      services: confirmationRendezvous.services.map((s) => ({
        serviceId: s.serviceId._id,
        etat: "en cours",
      })),
      pieces: confirmationRendezvous.pieces.map((p) => ({
        pieceId: p.piece._id,
        quantite: p.quantite,
      })),
      status: "en cours",
    });

    await intervention.save();

    return { confirmationRendezvous, intervention };
  }
}

module.exports = new RendezVousService();
