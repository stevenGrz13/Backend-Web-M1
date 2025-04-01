const { log } = require("winston");
const CrudService = require("../core/services/crud.service");
const Facture = require("../models/facture.model");
const Intervention = require("../models/intervention.model");
const RendezVous = require("../models/rendezvous.model");
const Vehicle = require("../models/vehicle.model");
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


  async getAllByClient(clientId, {page = 1, limit = 1}){
    try {

      let dataResponse = {};

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        Facture.find({userClientId: clientId}).skip(skip).limit(limit),
        Facture.countDocuments({userClientId: clientId}),
      ]);


      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      dataResponse = {
        data,
        pagination: {
          total,
          totalPages,
          currentPage: page,
          hasNext,
          hasPrev,
          limit,
        },
      };

      return dataResponse;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des véhicules: ${error.message}`);
    }
  }

  // async getBlocFactureByClientId(clientId) {
  //   const factures = await Facture.find({ userClientId: clientId })
  //     .populate({
  //       path: "userClientId",
  //       model: "User",
  //     })
  //     // .populate({
  //     //     path: "rendezVousId",
  //     //     populate: [
  //     //       { path: "vehiculeId", model: "Vehicle" },
  //     //       { path: "userClientId", model: "User" },
  //     //       { path: "userMecanicientId", model: "User" },
  //     //     ],
  //     //   })
  //     .populate({
  //       path: "services.serviceId",
  //       model: "Service",
  //     })
  //     .populate({
  //       path: "pieces.pieceId",
  //       model: "Piece",
  //     })
  //     .exec();
  //   return factures;
  // }

  /// POPULATED GET FACTURE BY CLIENT ID

  async getBlocFactureByClientId(clientId) {
    const factures = await Facture.find({ userClientId: clientId })
      .populate({
        path: "userClientId",
        model: "User",
      })
      .populate({
        path: "services.serviceId",
        model: "Service",
      })
      .populate({
        path: "pieces.pieceId",
        model: "Piece",
      })
      .exec();

    if (!factures.length) {
      return { success: false, message: "Aucune facture trouvée" };
    }

    const formattedFactures = factures.map((facture) => ({
      date: facture.date,
      factureId: facture._id,
      status: facture.statut === "payé" ? "PAID" : "PENDING",
      nomClient: `${facture.userClientId.firstName} ${facture.userClientId.name}`,
      emailClient: facture.userClientId.email,
      numeroClient: facture.userClientId.telephone || "",

      services: {
        details: facture.services.map((service) => ({
          serviceId: service.serviceId._id,
          nom: service.serviceId.nom,
          prix: service.prix,
          quantite: 1,
          montant: service.prix,
        })),
        total: facture.services.reduce((sum, service) => sum + service.prix, 0),
      },

      pieces: {
        details: facture.pieces.map((piece) => ({
          _id: piece.pieceId._id,
          nom: piece.pieceId.nom,
          prixUnitaire: piece.pieceId.prixunitaire,
          quantite: piece.quantite,
          montant: piece.prix,
        })),
        total: facture.pieces.reduce((sum, piece) => sum + piece.prix, 0),
      },

      montant: facture.total,
    }));

    return { formattedFactures };
  }
}

module.exports = new FactureService();
