const Intervention = require("../models/intervention.model");
const logger = require("../../utils/logger");
const CrudService = require("../core/services/crud.service");

class InterventionService extends CrudService {
  constructor() {
    super(Intervention);
  }

  async findInterventionByClientId(ClientId) {
    try {
      const interventions = await Intervention.find()
        .populate({
          path: "rendezVousId",
          match: { userClientId: ClientId },
          select:
            "userClientId date description vehiculeId services pieces statut",
        })
        .populate("services.serviceId", "nom prix")
        .populate("pieces.pieceId", "nom reference");

      const filteredInterventions = interventions.filter(
        (intervention) => intervention.rendezVousId
      );

      return filteredInterventions;
    } catch (error) {
      logger.error(
        "Erreur lors de la récupération des interventions du client:",
        error
      );
      throw new Error("Impossible de récupérer les interventions.");
    }
  }

  async getNumberOfIntervention() {
    logger.info("Recherche des interventions en cours...");
    const liste = await Intervention.find({ status: "en cours" });
    return {
      nombre: liste.length,
    };
  }

  async findOngoingInterventions() {
    logger.info("Recherche des interventions en cours...");
    const liste = await Intervention.find({ status: "en cours" }).populate(
      "rendezVousId services.serviceId pieces.pieceId"
    );
    return {
      liste: liste,
      nombre: liste.length,
    };
  }

  async updateServiceStatus(id, serviceId, etat) {
    logger.info(
      `Mise à jour de l'état du service ${serviceId} dans l'intervention ${id} en ${etat}`
    );
    return Intervention.findOneAndUpdate(
      { _id: id, "services.serviceId": serviceId },
      { $set: { "services.$.etat": etat } },
      { new: true }
    ).populate("rendezVousId services.serviceId pieces.pieceId");
  }

  async updatePieceQuantity(id, pieceId, quantite) {
    logger.info(
      `Mise à jour de la quantité de la pièce ${pieceId} dans l'intervention ${id} à ${quantite}`
    );
    return Intervention.findOneAndUpdate(
      { _id: id, "pieces.pieceId": pieceId },
      { $set: { "pieces.$.quantite": quantite } },
      { new: true }
    ).populate("rendezVousId services.serviceId pieces.pieceId");
  }

  async finalizeIntervention(id) {
    logger.info(`Finalisation de l'intervention avec ID: ${id}`);
    return Intervention.findByIdAndUpdate(
      id,
      { status: "terminee" },
      { new: true }
    ).populate("rendezVousId services.serviceId pieces.pieceId");
  }
}

module.exports = new InterventionService();
