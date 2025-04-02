const RendezVous = require("../models/rendezvous.model");
const CrudService = require("../core/services/crud.service");
const Intervention = require("../models/intervention.model");
const userService = require("./user.service");
class RendezVousService extends CrudService {
  constructor() {
    super(RendezVous);
  }

  async getInfosByUser(userType, userId, {page = 1, limit = 10}) {
    try {
      const skip = (page - 1) * limit;

      // Détermine le champ de recherche en fonction du type d'utilisateur
      const queryField = userType === 'mechanic'
          ? 'userMecanicientId'
          : 'userClientId';

      const query = { [queryField]: userId };

      const [data, total] = await Promise.all([
        RendezVous.find(query)
            .skip(skip)
            .limit(limit)
            .populate('userClientId', '-password')
            .populate('userMecanicientId', '-password')
            .populate('vehiculeId')
            .populate({
              path: 'services.serviceId',
              model: 'Service'
            })
            .populate({
              path: 'pieces.piece',
              model: 'Piece'
            })
            .exec(),
        RendezVous.countDocuments(query), // Important d'utiliser le même query pour le count
      ]);

      return this.formatPaginatedResponse(data, total, page, limit);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des rendez-vous: ${error.message}`);
    }
  }

// Les méthodes originales deviennent alors des wrappers simples
  async getInfosByMechanic(mechanicId, pagination) {
    return this.getInfosByUser('mechanic', mechanicId, pagination);
  }

  async getInfosByClient(clientId, pagination) {
    return this.getInfosByUser('client', clientId, pagination);
  }

  // utils/responseFormatter.js

  formatPaginatedResponse(data, total, page, limit) {
    // Formatage des données
    const dataFormatted = data.map(item => ({
      _id: item._id,
      start: item.date,
      client: item.userClientId,
      status: item.statut,
      mechanical: item.userMecanicientId,
    }));

    // Calcul de la pagination
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // Retour de la réponse formatée
    return {
      data: dataFormatted,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNext,
        hasPrev,
        limit,
      },
    };
  }

  async getInfos({page = 1, limit = 10}) {
    try {

      let dataResponse = {};

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        RendezVous.find()
            .skip(skip)
            .limit(limit)
            .populate('userClientId', '-password') // Peuple le client (en excluant le mot de passe)
            .populate('userMecanicientId', '-password') // Peuple le mécanicien (en excluant le mot de passe)
            .populate('vehiculeId') // Peuple le véhicule
            .populate({
              path: 'services.serviceId', // Peuple les services dans le tableau
              model: 'Service'
            })
            .populate({
              path: 'pieces.piece', // Peuple les pièces dans le tableau
              model: 'Piece'
            })
            .exec(),
        RendezVous.countDocuments(),
      ]);

      return this.formatPaginatedResponse(data, total, page, limit);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des véhicules: ${error.message}`);
    }
  }

  async findRendezVousByDate(date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return await RendezVous.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate("services.serviceId");
  }

  async getRendezVousParClient(clientId) {
    return await RendezVous.find({ userClientId: clientId }).populate(
      "userClientId",
      "nom prenom courriel"
    );
  }

  async getRendezVousParMecanicien(mecanicienId) {
    const value = await RendezVous.find({
      userMecanicientId: mecanicienId,
    }).populate("userMecanicientId", "nom prenom courriel");
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
    )
      .populate("services.serviceId")
      .populate("pieces.piece");

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

  async genererRendezVousAvecSuggestion(data) {
    try{
      const userService = require("../services/user.service");
      const date = data.date;
      const mecanicienLibre = await userService.findMecanicienLibreByDate(date);
      if(mecanicienLibre.nombre > 0){
        var mecanicienId = mecanicienLibre.mecaniciens[0]._id;
        data.userMecanicientId = mecanicienId.toString();
        const rendezVous = await RendezVous.create(data);
        return rendezVous;
      }
      else{
        const message = "Aucun Mecanicien Libre pour votre Date";
        return message;
      }
    }catch (error){
      console.error(error)
      throw error;
    }
  }
}

module.exports = new RendezVousService();
