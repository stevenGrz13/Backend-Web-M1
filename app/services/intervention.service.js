const Intervention = require("../models/intervention.model");
const logger = require("../../utils/logger");
const CrudService = require("../core/services/crud.service");
const factureService = require("../services/facture.service");
const serviceService = require("../services/services.service");
const RendezVous = require("../models/rendezvous.model");
const Facture = require("../models/facture.model");
class InterventionService extends CrudService {
  constructor() {
    super(Intervention);
  }

  async #getRendezVousIds(query) {
    return RendezVous.find(query).select("_id");
  }

  async #getInterventionsWithPagination(rendezVousIds, { page, limit }, sort = {}) {
    const skip = (page - 1) * limit;
    const rendezVousIdsArray = rendezVousIds.map((r) => r._id);
    const query = { rendezVousId: { $in: rendezVousIdsArray } };

    const [interventions, total] = await Promise.all([
      Intervention.find(query)
          .sort(sort)
          .populate(this.#getPopulateOptions())
          .populate("services.serviceId")
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
      Intervention.countDocuments(query)
    ]);

    return { interventions, total };
  }

  #getPopulateOptions() {
    return {
      path: "rendezVousId",
      populate: [
        {
          path: "userClientId",
          model: "User",
          select: "name firstName email",
        },
        {
          path: "userMecanicientId",
          model: "User",
          select: "name firstName email",
        },
        { path: "vehiculeId", model: "Vehicle" },
      ],
    };
  }

  #formatInterventionData(intervention, includeCreatedAt = false) {
    const estimateTime = intervention.services.reduce((total, serviceItem) => {
      if (serviceItem.etat === "en cours" && serviceItem.serviceId?.duree) {
        return total + serviceItem.serviceId.duree;
      }
      return total;
    }, 0);

    const baseData = {
      _id: intervention._id,
      client: intervention.rendezVousId?.userClientId,
      mecanicien: intervention.rendezVousId?.userMecanicientId,
      vehicle: intervention.rendezVousId?.vehiculeId,
      status: intervention.status,
      estimateTime,
      avancement: intervention.avancement,
      services: intervention.services.map((s) => ({
        serviceId: s.serviceId,
        etat: s.etat,
      })),
      pieces: intervention.pieces,
    };

    if (includeCreatedAt) {
      baseData.createdAt = intervention.createdAt;
    }

    return baseData;
  }

  #buildPaginationResponse(data, total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        limit,
      },
    };
  }

  #getFullPopulateOptions() {
    return [
      {
        path: "rendezVousId",
        populate: [
          { path: "vehiculeId", model: "Vehicle" },
          { path: "userClientId", model: "User" },
          { path: "userMecanicientId", model: "User" },
        ],
      },
      {
        path: "services.serviceId",
        model: "Service",
      },
      {
        path: "pieces.pieceId",
        model: "Piece",
      },
    ];
  }

  // Méthodes publiques
  async getAllByMechanic(mechanicId, { page = 1, limit = 10 }) {
    try {
      const rendezVousIds = await this.#getRendezVousIds({ userMecanicientId: mechanicId });
      const { interventions, total } = await this.#getInterventionsWithPagination(
          rendezVousIds,
          { page, limit }
      );

      const formattedData = interventions.map(intervention =>
          this.#formatInterventionData(intervention)
      );

      return this.#buildPaginationResponse(formattedData, total, page, limit);
    } catch (error) {
      console.error("Error in getAllByMechanic:", error);
      throw new Error(`Erreur lors de la récupération des interventions: ${error.message}`);
    }
  }

  async getHistoriesByClient(clientId, { page = 1, limit = 10 }) {
    try {
      const rendezVousIds = await this.#getRendezVousIds({ userClientId: clientId });
      const { interventions, total } = await this.#getInterventionsWithPagination(
          rendezVousIds,
          { page, limit },
          { createdAt: -1 }
      );

      const formattedData = interventions.map(intervention =>
          this.#formatInterventionData(intervention, true)
      );

      return this.#buildPaginationResponse(formattedData, total, page, limit);
    } catch (error) {
      console.error("Error in getHistoriesByClient:", error);
      throw new Error(`Erreur lors de la récupération des historiques: ${error.message}`);
    }
  }

  async getAllPaginate({ page = 1, limit = 10, filters = {} }) {
    try {
      const skip = (page - 1) * limit;
      const query = filters.rendezVousId ? { rendezVousId: filters.rendezVousId } : {};

      const [interventions, total] = await Promise.all([
        Intervention.find(query)
            .populate(this.#getPopulateOptions())
            .populate("services.serviceId")
            .skip(skip)
            .limit(limit)
            .lean()
            .exec(),
        Intervention.countDocuments(query)
      ]);

      const formattedData = interventions.map(intervention =>
          this.#formatInterventionData(intervention, true)
      );

      return this.#buildPaginationResponse(formattedData, total, page, limit);
    } catch (error) {
      console.error("Error in getAll:", error);
      throw new Error(`Erreur lors de la récupération de toutes les interventions: ${error.message}`);
    }
  }

  async getLatestFive() {
    try {
      const rendezVousIds = await RendezVous.find().select("_id");
      const query = {
        status: "en cours",
        rendezVousId: { $in: rendezVousIds.map((r) => r._id) },
      };

      const interventions = await Intervention.find(query)
          .sort({ createdAt: -1 })
          .populate(this.#getPopulateOptions())
          .populate("services.serviceId")
          .limit(5)
          .lean()
          .exec();

      const formattedData = interventions.map(intervention =>
          this.#formatInterventionData(intervention)
      );

      return { data: formattedData };
    } catch (error) {
      console.error("Error in getLatestFive:", error);
      throw new Error(`Erreur lors de la récupération des interventions: ${error.message}`);
    }
  }

  async findInterventionByClientId(clientId) {
    try {
      const interventions = await Intervention.find()
          .populate({
            path: "rendezVousId",
            match: { userClientId: clientId },
            select: "userClientId date description vehiculeId services pieces statut",
          })
          .populate("services.serviceId", "nom prix")
          .populate("pieces.pieceId", "nom reference");

      return interventions.filter((intervention) => intervention.rendezVousId);
    } catch (error) {
      logger.error("Erreur lors de la récupération des interventions du client:", error);
      throw new Error("Impossible de récupérer les interventions.");
    }
  }

  async getNumberOfIntervention() {
    const liste = await Intervention.find({ status: "en cours" });
    return { nombre: liste.length };
  }

  async findNombreInterventionParEtat() {
    const [listeEnCours, listeFacturee, listeAttente] = await Promise.all([
      Intervention.find({ status: "en cours" }).populate(this.#getFullPopulateOptions()),
      Intervention.find({ status: "facturee" }).populate(this.#getFullPopulateOptions()),
      Intervention.find({ status: "en attente" }).populate(this.#getFullPopulateOptions()),
    ]);

    return {
      encours: listeEnCours.length,
      facturee: listeFacturee.length,
      enattente: listeAttente.length,
    };
  }

  async findOngoingInterventions() {
    const liste = await Intervention.find({ status: "en cours" })
        .populate(this.#getFullPopulateOptions());

    return { liste, nombre: liste.length };
  }

  async updateServiceStatus(id, serviceId, etat) {
    return Intervention.findOneAndUpdate(
        { _id: id, "services.serviceId": serviceId },
        { $set: { "services.$.etat": etat } },
        { new: true }
    ).populate(this.#getFullPopulateOptions());
  }

  async updatePieceQuantity(id, pieceId, quantite) {
    return Intervention.findOneAndUpdate(
        { _id: id, "pieces.pieceId": pieceId },
        { $set: { "pieces.$.quantite": quantite } },
        { new: true }
    ).populate(this.#getFullPopulateOptions());
  }

  async finalizeIntervention(id) {
    const facture = await factureService.genererFacture(id);
    await Intervention.updateOne(
        { _id: id },
        { $set: { status: "facturee" } }
    );
    const intervention = await Intervention.findById(id);
    return { intervention, facture };
  }

  async getBlocAllIntervention(status) {
    return Intervention.find({ status })
        .populate(this.#getFullPopulateOptions())
        .exec();
  }

  async getBlocAllFacture() {
    return Facture.find({ statut: "payee" })
        .populate("services.serviceId")
        .populate("pieces.pieceId")
        .exec();
  }

  async getBlocTodayFacture() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return Facture.find({
      date: { $gte: startOfDay, $lt: endOfDay },
      statut: "payee",
    })
        .populate("services.serviceId")
        .populate("pieces.pieceId")
        .exec();
  }

  async getOngoingInterventionForDashboard() {
    try {
      const interventions = await this.getBlocAllIntervention("en cours");

      return interventions.map((intervention) => {
        const rendezVous = intervention.rendezVousId || {};
        const duration = intervention.services.reduce(
            (acc, service) => acc + (service.serviceId?.duree || 0), 0
        );

        return {
          _id: intervention._id,
          status: intervention.status,
          vehicle: rendezVous.vehiculeId || {},
          client: rendezVous.userClientId || {},
          mecanicien: rendezVous.userMecanicientId || {},
          remainingTime: duration > 0 ? `${Math.floor(duration)} min` : "Terminé",
          services: intervention.services.map((service) => ({
            ...service.serviceId?._doc,
            etat: service.etat,
          })),
          pieces: intervention.pieces.map((piece) => ({
            ...piece.pieceId?._doc,
            quantite: piece.quantite,
          })),
        };
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des interventions :", error);
      throw new Error("Erreur serveur lors de la récupération des interventions.");
    }
  }

  async getDetails(id) {
    try {
      const intervention = await Intervention.findById(id)
          .populate(this.#getFullPopulateOptions())
          .exec();

      return this.#formatInterventionDetails(intervention);
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'intervention ${id}:`, error);
      throw new Error(`Erreur serveur lors de la récupération de l'intervention ${id}.`);
    }
  }

  #formatInterventionDetails(intervention) {
    if (!intervention) return null;

    const rendezVous = intervention.rendezVousId || {};
    const duration = intervention.services.reduce((total, serviceItem) => {
      if (serviceItem.etat === "en cours" && serviceItem.serviceId?.duree) {
        return total + serviceItem.serviceId.duree;
      }
      return total;
    }, 0);

    return {
      _id: intervention._id,
      status: intervention.status,
      vehicle: rendezVous.vehiculeId || {},
      client: rendezVous.userClientId || {},
      mechanical: rendezVous.userMecanicientId || {},
      estimateTime: Math.floor(duration),
      services: intervention.services.map((service) => ({
        ...service.serviceId?._doc,
        etat: service.etat,
      })),
      pieces: intervention.pieces.map((piece) => ({
        ...piece.pieceId?._doc,
        quantite: piece.quantite,
        etat: piece.etat
      })),
    };
  }

  async getLatestInterventionByVehicleId(vehicleId) {
    try {
      const intervention = await Intervention.findOne()
          .sort({ createdAt: -1 })
          .populate({
            path: "rendezVousId",
            match: { vehiculeId: vehicleId },
            populate: [
              { path: "vehiculeId", model: "Vehicle" },
              { path: "userClientId", model: "User" },
              { path: "userMecanicientId", model: "User" },
            ],
          })
          .populate("services.serviceId")
          .populate("pieces.pieceId")
          .exec();

      if (!intervention || !intervention.rendezVousId) return null;

      return this.#formatInterventionDetails(intervention);
    } catch (error) {
      console.error(`Erreur lors de la récupération pour le véhicule ${vehicleId}:`, error);
      throw new Error(`Erreur serveur pour le véhicule ${vehicleId}.`);
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
          .populate("services.serviceId")
          .populate("pieces.pieceId")
          .exec();

      return interventions
          .filter((i) => i.rendezVousId !== null)
          .map(this.#formatInterventionDetails);
    } catch (error) {
      console.error(`Erreur pour le véhicule ${vehicleId}:`, error);
      throw new Error(`Erreur serveur pour le véhicule ${vehicleId}.`);
    }
  }

  async statChiffreAffaireByService(demande) {
    const interventions = await this.getBlocAllFacture();
    const pourcentage = new Map();
    let chiffreaffaire = 0;

    interventions.forEach((intervention) => {
      intervention.services.forEach((service) => {
        const serviceId = service.serviceId.nom.toString();
        const prixActuel = parseFloat(service.serviceId.prix) || 0;

        pourcentage.set(
            serviceId,
            (parseFloat(pourcentage.get(serviceId) || 0) + prixActuel).toFixed(2)
        );
        chiffreaffaire += prixActuel;
      });
    });

    chiffreaffaire = chiffreaffaire.toFixed(2);

    if (demande === "pourcentage") {
      pourcentage.forEach((value, key) => {
        pourcentage.set(key, (value * 100) / chiffreaffaire);
      });
    }

    return Object.fromEntries(pourcentage);
  }

  async totalRevenuToday() {
    const factures = await this.getBlocTodayFacture();
    const total = factures.reduce((sum, facture) => sum + Number(facture.total), 0);
    return { chiffreAffaire: Number(total.toFixed(2)) };
  }

  async totalRevenuParService() {
    const factures = await this.getBlocAllFacture();
    const total = factures.reduce((sum, facture) => {
      return sum + facture.services.reduce((s, service) => s + parseFloat(service.prix), 0);
    }, 0);
    return { chiffreAffaire: total.toFixed(2) };
  }

  async FinirService(serviceId, interventionId) {
    let intervention = await Intervention.findById(interventionId);
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

    if (nombreServiceFinis === intervention.services.length) {
      intervention.status = "terminee";
    }

    intervention.avancement = (nombreServiceFinis * 100) / intervention.services.length;
    await intervention.save();

    if (intervention.avancement >= 100) {
      await this.finalizeIntervention(interventionId);
    }

    return this.getDetails(interventionId);
  }

  async AjouterPiece(interventionId, pieceId, quantite) {
    const intervention = await Intervention.findById(interventionId.toString());
    if (!intervention) throw new Error("Intervention non trouvée");

    intervention.pieces = intervention.pieces || [];
    intervention.pieces.push({ pieceId, quantite, etat: false });

    await intervention.save();
    return this.getDetails(interventionId);
  }

  async ApprouverPiece(interventionId, pieceId) {
    try {
      const intervention = await Intervention.findById(interventionId);
      if (!intervention) throw new Error("Intervention non trouvée");

      const piece = intervention.pieces.find((p) => p.pieceId.toString() === pieceId);
      if (!piece) throw new Error("Pièce non trouvée dans l'intervention");

      piece.etat = true;
      await intervention.save();

      return this.getDetails(interventionId);
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = new InterventionService();
