

const Intervention = require("../models/intervention.model");
const logger = require("../../utils/logger");
const CrudService = require("../core/services/crud.service");
const factureService = require("../services/facture.service");
const serviceService = require("../services/services.service");
const RendezVous = require("../models/rendezvous.model")
class InterventionService extends CrudService {
  constructor() {
    super(Intervention);
  }

  async getAllByMechanic(mechanicId, {page = 1, limit = 10}) {
    try {
      const skip = (page - 1) * limit;

      // D'abord trouver les rendez-vous associés au mécanicien
      const rendezVousIds = await RendezVous.find({
        userMecanicientId: mechanicId
      }).select('_id');

      // Ensuite trouver les interventions correspondantes
      const [interventions, total] = await Promise.all([
        Intervention.find({
          rendezVousId: { $in: rendezVousIds.map(r => r._id) }
        })
            .populate({
              path: 'rendezVousId',
              populate: [
                { path: 'userClientId', model: 'User', select: 'name firstName email' },
                { path: 'userMecanicientId', model: 'User', select: 'name firstName email' },
                { path: 'vehiculeId', model: 'Vehicle' }
              ]
            })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec(),

        Intervention.countDocuments({
          rendezVousId: { $in: rendezVousIds.map(r => r._id) }
        })
      ]);

      // Transformer les données
      const formattedData = interventions.map(intervention => ({
        _id: intervention._id,
        client: intervention.rendezVousId?.userClientId,
        mecanicien: intervention.rendezVousId?.userMecanicientId,
        vehicle: intervention.rendezVousId?.vehiculeId,
        status: intervention.status,
        estimateTime: intervention.createdAt
      }));

      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      return {
        data: formattedData,
        pagination: {
          total,
          totalPages,
          currentPage: page,
          hasNext,
          hasPrev,
          limit,
        },
      };
    } catch (error) {
      console.error('Error in getAllByMechanic:', error);
      throw new Error(`Erreur lors de la récupération des interventions: ${error.message}`);
    }
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
    const listeAttente = await Intervention.find({
      status: "en attente",
    }).populate("rendezVousId services.serviceId pieces.pieceId");
    return {
      encours: listeEnCours.length,
      facturee: listeFacturee.length,
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
      { $set: { status: "facturee" } }
    );
    intervention = result;
    return { intervention, facture };
  }

  async getBlocAllIntervention(status) {
    const interventions = await Intervention.find({ status: status })
      .populate({
        path: "rendezVousId",
        populate: [
          { path: "vehiculeId", model: "Vehicle" }, // Récupère tous les champs du véhicule
          { path: "userClientId", model: "User" }, // Récupère tous les champs du client
          { path: "userMecanicientId", model: "User" }, // Récupère tous les champs du mécano
        ],
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
    return interventions;
  }

  async getOngoingInterventionForDashboard() {
    try {
      const interventions = await this.getBlocAllIntervention("en cours");

      const interventionsWithDetails = interventions.map((intervention) => {
        const rendezVous = intervention.rendezVousId;
        const vehicle = rendezVous?.vehiculeId || {};
        const client = rendezVous?.userClientId || {};
        const mecanicien = rendezVous?.userMecanicientId || {};

        let duration = intervention.services.reduce(
          (acc, service) => acc + (service.serviceId?.duree || 0),
          0
        );

        return {
          _id: intervention._id,
          status: intervention.status,
          vehicle, // Contient tous les attributs du véhicule
          client, // Contient tous les attributs du client
          mecanicien, // Contient tous les attributs du mécano
          remainingTime:
            duration > 0 ? `${Math.floor(duration)} min` : "Terminé",
          services: intervention.services.map((service) => ({
            ...service.serviceId._doc, // Tous les attributs du service
            etat: service.etat,
          })),
          pieces: intervention.pieces.map((piece) => ({
            ...piece.pieceId._doc, // Tous les attributs de la pièce
            quantite: piece.quantite,
          })),
        };
      });

      return interventionsWithDetails;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des interventions :",
        error
      );
      throw new Error(
        "Erreur serveur lors de la récupération des interventions."
      );
    }
  }

  async getDetails(id) {
    try {
      const intervention = await Intervention.findById(id)
        .populate({
          path: "rendezVousId",
          populate: [
            { path: "vehiculeId", model: "Vehicle" },
            { path: "userClientId", model: "User" },
            { path: "userMecanicientId", model: "User" },
          ],
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

      return this.formatInterventionDetails(intervention);
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de l'intervention ${id}:`,
        error
      );
      throw new Error(
        `Erreur serveur lors de la récupération de l'intervention ${id}.`
      );
    }
  }

  formatInterventionDetails(intervention) {
    if (!intervention) return null;

    const rendezVous = intervention.rendezVousId || {};
    const vehicle = rendezVous.vehiculeId || {};
    const client = rendezVous.userClientId || {};
    const mechanical = rendezVous.userMecanicientId || {};

    const duration = intervention.services.reduce(
      (acc, service) => acc + (service.serviceId?.duree || 0),
      0
    );

    return {
      _id: intervention._id,
      status: intervention.status,
      vehicle,
      client,
      mechanical,
      estimateTime: Math.floor(duration),
      services: intervention.services.map((service) => ({
        ...service.serviceId?._doc,
        etat: service.etat,
      })),
      pieces: intervention.pieces.map((piece) => ({
        ...piece.pieceId?._doc,
        quantite: piece.quantite,
      })),
    };
  }

  async getLatestInterventionByVehicleId(vehicleId, status = "en cours") {
    try {
      const intervention = await Intervention.findOne({ status })
        .sort({ createdAt: -1 }) // Tri par date de création décroissante
        .populate({
          path: "rendezVousId",
          match: { vehiculeId: vehicleId },
          populate: [
            { path: "vehiculeId", model: "Vehicle" },
            { path: "userClientId", model: "User" },
            { path: "userMecanicientId", model: "User" },
          ],
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

      // Vérifier si l'intervention existe et a un rendezVousId valide
      if (!intervention || !intervention.rendezVousId) {
        return null;
      }

      return this.formatInterventionDetails(intervention);
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de l'intervention pour le véhicule ${vehicleId}:`,
        error
      );
      throw new Error(
        `Erreur serveur lors de la récupération de l'intervention du véhicule ${vehicleId}.`
      );
    }
  }

  async getByVehicleId(vehicleId, status = "en cours") {
    try {
      const interventions = await Intervention.find({ status })
        .populate({
          path: "rendezVousId",
          match: { vehiculeId: vehicleId },
          populate: [
            { path: "vehiculeId", model: "Vehicle" },
            { path: "userClientId", model: "User" },
            { path: "userMecanicientId", model: "User" },
          ],
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

      // Filtrer les interventions où rendezVousId n'est pas null
      const filteredInterventions = interventions.filter(
        (i) => i.rendezVousId !== null
      );

      return filteredInterventions.map(this.formatInterventionDetails);
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des interventions pour le véhicule ${vehicleId}:`,
        error
      );
      throw new Error(
        `Erreur serveur lors de la récupération des interventions du véhicule ${vehicleId}.`
      );
    }
  }

  async statChiffreAffaireByService(demande) {
    const interventions = await this.getBlocAllIntervention("facturee");
    let chiffreaffaire = 0;

    const pourcentage = new Map();

    for (let i = 0; i < interventions.length; i++) {
      for (let z = 0; z < interventions[i].services.length; z++) {
        const service = interventions[i].services[z].serviceId;
        const serviceId = service.nom.toString();
        const prixActuel = parseFloat(service.prix) || 0;

        if (pourcentage.has(serviceId)) {
          pourcentage.set(
            serviceId,
            (parseFloat(pourcentage.get(serviceId)) + prixActuel).toFixed(2)
          );
        } else {
          pourcentage.set(serviceId, prixActuel.toFixed(2));
        }
        chiffreaffaire += parseFloat(service.prix) || 0;
      }
    }

    chiffreaffaire = chiffreaffaire.toFixed(2);

    if (demande == "pourcentage") {
      pourcentage.forEach((value, key) => {
        let newValue = (value * 100) / chiffreaffaire;
        pourcentage.set(key, newValue);
      });
    }

    const pourcentageObj = Object.fromEntries(pourcentage);
    return pourcentageObj;
  }

  async totalRevenuParService() {
    const interventions = await this.getBlocAllIntervention();
    let chiffreaffaire = 0;

    for (let i = 0; i < interventions.length; i++) {
      for (let z = 0; z < interventions[i].services.length; z++) {
        const service = interventions[i].services[z].serviceId;
        chiffreaffaire += parseFloat(service.prix) || 0;
      }
    }

    chiffreaffaire = chiffreaffaire.toFixed(2);

    console.log("chiffre affaire = ", chiffreaffaire);

    return { chiffreAffaire: chiffreaffaire };
  }

  async FinirService(serviceId, interventionId) {
    let intervention = await this.getById(interventionId);
    if (!intervention) throw new Error("Intervention non trouvée");

    let nombreServiceFinis = 0;

    intervention.services = intervention.services.map((service) => {
      if (service.serviceId.toString() === serviceId.toString()) {
        service.etat = "fini";
      }
      if (service.etat === "fini") {
        nombreServiceFinis++;
      }
      return service;
    });

    intervention.avancement =
      (nombreServiceFinis * 100) / intervention.services.length;
    return await this.update(interventionId, intervention);
  }
}

module.exports = new InterventionService();
