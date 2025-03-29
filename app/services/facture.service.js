const { log } = require("winston");
const CrudService = require("../core/services/crud.service");
const Facture = require("../models/facture.model");
const Intervention = require("../models/intervention.model");
const RendezVous = require("../models/rendezvous.model");

class FactureService extends CrudService {
  constructor() {
    super(Facture);
  }

  async genererFacture(interventionId) {
    try {
      const intervention = await Intervention.findById(interventionId).populate(
        "rendezVousId services.serviceId pieces.pieceId"
      );

      if (!intervention) {
        throw new Error("Intervention introuvable");
      }

      const rendezVous = await RendezVous.findById(intervention.rendezVousId);
      if (!rendezVous) {
        throw new Error("Rendez-vous introuvable");
      }

      let totalServices = 0;
      let totalPieces = 0;

      const servicesFactures = intervention.services.map((service) => {
        const prix = parseFloat(service.serviceId.prix);
        totalServices += prix;
        return {
          serviceId: service.serviceId._id,
          prix: prix,
          etat: service.etat,
        };
      });

      const piecesFactures = intervention.pieces.map((piece) => {
        const prixTotal =
          parseFloat(piece.pieceId.prixunitaire) * piece.quantite;
        totalPieces += prixTotal;
        return {
          pieceId: piece.pieceId._id,
          quantite: piece.quantite,
          prix: prixTotal,
        };
      });

      const total = (totalServices + totalPieces).toFixed(2);

      const facture = new Facture({
        userClientId: rendezVous.userClientId,
        interventionId: intervention._id,
        date: new Date(),
        vehiculeId: rendezVous.vehiculeId,
        services: servicesFactures,
        pieces: piecesFactures,
        total: total,
      });

      await Facture.create(facture);
      return facture;
    } catch (error) {
      console.error("Erreur lors de la génération de la facture:", error);
      throw error;
    }
  }
}

module.exports = new FactureService();
