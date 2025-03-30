const Intervention = require("../models/intervention.model");
const logger = require("../../utils/logger");
const CrudService = require("../core/services/crud.service");
const factureService = require("../services/facture.service");
const serviceService = require("../services/services.service");
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

  async findNombreInterventionParEtat() {
    const listeEnCours = await Intervention.find({
      status: "en cours",
    }).populate("rendezVousId services.serviceId pieces.pieceId");
    const listeFacturee = await Intervention.find({
      status: "facturee",
    }).populate("rendezVousId services.serviceId pieces.pieceId");
    const listeTerminee = await Intervention.find({
      status: "terminee",
    }).populate("rendezVousId services.serviceId pieces.pieceId");
    const listeAttente = await Intervention.find({
      status: "en attente",
    }).populate("rendezVousId services.serviceId pieces.pieceId");
    return {
      encours: listeEnCours.length,
      facturee: listeFacturee.length,
      terminee: listeTerminee.length,
      enattente: listeAttente.length,
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
    const facture = await factureService.genererFacture(id);
    let intervention = await Intervention.findById(id);
    const result = await Intervention.updateOne(
      { _id: id },
      { $set: { status: "terminee" } }
    );
    intervention = result;
    return { intervention, facture };
  }

  async getOngoingInterventionForDashboard() {
    try {
      const interventions = await Intervention.find({ status: "en cours" })
        .populate({
          path: "rendezVousId",
          populate: [
            { path: "vehiculeId", model: "Vehicle" }, // Récupère tous les champs du véhicule
            { path: "userClientId", model: "User" },  // Récupère tous les champs du client
            { path: "userMecanicientId", model: "User" } // Récupère tous les champs du mécano
          ],
        })
        .populate({
          path: "services.serviceId",
          model: "Service"
        })
        .populate({
          path: "pieces.pieceId",
          model: "Piece"
        })
        .exec();
  
      const interventionsWithDetails = interventions.map(intervention => {
        const rendezVous = intervention.rendezVousId;
        const vehicle = rendezVous?.vehiculeId || {};
        const client = rendezVous?.userClientId || {};
        const mecanicien = rendezVous?.userMecanicientId || {};
  
        let duration = intervention.services.reduce((acc, service) => acc + (service.serviceId?.duree || 0), 0);
  
        return {
          _id: intervention._id,
          status: intervention.status,
          vehicle, // Contient tous les attributs du véhicule
          client,  // Contient tous les attributs du client
          mecanicien, // Contient tous les attributs du mécano
          remainingTime: duration > 0 ? `${Math.floor(duration)} min` : "Terminé",
          services: intervention.services.map(service => ({
            ...service.serviceId._doc, // Tous les attributs du service
            etat: service.etat
          })),
          pieces: intervention.pieces.map(piece => ({
            ...piece.pieceId._doc, // Tous les attributs de la pièce
            quantite: piece.quantite
          }))
        };
      });
  
      return interventionsWithDetails;
    } catch (error) {
      console.error("Erreur lors de la récupération des interventions :", error);
      throw new Error("Erreur serveur lors de la récupération des interventions.");
    }
  }
  
  
}

module.exports = new InterventionService();
