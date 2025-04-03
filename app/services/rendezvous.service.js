const RendezVous = require("../models/rendezvous.model");
const CrudService = require("../core/services/crud.service");
const Intervention = require("../models/intervention.model");
const userService = require("./user.service");
class RendezVousService extends CrudService {
  constructor() {
    super(RendezVous);
  }

  async getInfosByUser(userType, userId, { page = 1, limit = 10 }) {
    try {
      const skip = (page - 1) * limit;

      // Détermine le champ de recherche en fonction du type d'utilisateur
      const queryField =
        userType === "mechanic" ? "userMecanicientId" : "userClientId";

      const query = { [queryField]: userId };

      const [data, total] = await Promise.all([
        RendezVous.find(query)
          .skip(skip)
          .limit(limit)
          .populate("userClientId", "-password")
          .populate("userMecanicientId", "-password")
          .populate("vehiculeId")
          .populate({
            path: "services.serviceId",
            model: "Service",
          })
          .populate({
            path: "pieces.piece",
            model: "Piece",
          })
          .exec(),
        RendezVous.countDocuments(query), // Important d'utiliser le même query pour le count
      ]);

      return this.formatPaginatedResponse(data, total, page, limit);
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des rendez-vous: ${error.message}`
      );
    }
  }

  // Les méthodes originales deviennent alors des wrappers simples
  async getInfosByMechanic(mechanicId, pagination) {
    return this.getInfosByUser("mechanic", mechanicId, pagination);
  }

  async getInfosByClient(clientId, pagination) {
    return this.getInfosByUser("client", clientId, pagination);
  }

  // utils/responseFormatter.js

  formatPaginatedResponse(data, total, page, limit) {

    let duration = 0;

    for (let i = 0; i < data[0].services.length; i++) {
      duration += data[0].services[i].serviceId.duree;
    }

    // Formatage des données
    const dataFormatted = data.map((item) => ({
      _id: item._id,
      start: item.date,
      client: item.userClientId,
      status: item.statut,
      mechanical: item.userMecanicientId,
      serviceTime: duration,
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

  async getInfos({ page = 1, limit = 10 }) {
    try {

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        RendezVous.find()
          .skip(skip)
          .limit(limit)
          .populate("userClientId", "-password") // Peuple le client (en excluant le mot de passe)
          .populate("userMecanicientId", "-password") // Peuple le mécanicien (en excluant le mot de passe)
          .populate("vehiculeId") // Peuple le véhicule
          .populate({
            path: "services.serviceId", // Peuple les services dans le tableau
            model: "Service",
          })
          .populate({
            path: "pieces.piece", // Peuple les pièces dans le tableau
            model: "Piece",
          })
          .exec(),
        RendezVous.countDocuments(),
      ]);

      return this.formatPaginatedResponse(data, total, page, limit);
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des véhicules: ${error.message}`
      );
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
    const interventionExistante = await Intervention.findOne({
      rendezVousId: rendezVousId
    });

    if (interventionExistante) {
      throw new Error("Impossible d'annuler ce rendez-vous car une intervention est déjà en cours");
    }

    await RendezVous.findByIdAndUpdate(
        rendezVousId,
        { statut: "annulé" },
        { new: true }
    );

    return this.getDetail(rendezVousId);
    // try{
    //
    // }catch (err){
    //   // console.error(err)
    //   // throw err;
    // }
  }

  async confirmerRendezVous(rendezVousId) {
    let appointment = await RendezVous.findOne({_id: rendezVousId})
        .populate("services.serviceId")
        .populate("pieces.piece").exec();
    if (!appointment){
      throw new Error("Rendez-vous non trouvé");
    }else if(appointment.statut === "confirmé"){
      throw new Error("Une intervention est déjà en cours")
    }

    appointment.statut = 'confirmé'


    // const confirmationRendezvous = await RendezVous.findByIdAndUpdate(
    //   rendezVousId,
    //   { statut: "confirmé" },
    //   { new: true }
    // )
    //   .populate("services.serviceId")
    //   .populate("pieces.piece");
    //
    // if (!confirmationRendezvous) {
    //   throw new Error("Rendez-vous non trouvé");
    // }

    await this.update(rendezVousId, appointment);

    const intervention = new Intervention({
      rendezVousId,
      services: appointment.services.map((s) => ({
        serviceId: s.serviceId._id,
        etat: "en cours",
      })),
      pieces: appointment.pieces.map((p) => ({
        pieceId: p.piece._id,
        quantite: p.quantite,
      })),
      status: "en cours",
    });

    await intervention.save();

    return this.getDetail(rendezVousId);
  }

  async genererRendezVousAvecSuggestion(data) {
    try {
      const userService = require("../services/user.service");
      const serviceService = require("../services/services.service"); // Vous aurez besoin d'un service pour les services

      // 1. Calculer la durée totale des services
      const services = await Promise.all(
          data.services.map(async (serviceItem) => {
            return await serviceService.getById(serviceItem.serviceId);
          })
      );
      
      const dureeTotaleMinutes = services.reduce((total, service) => {
        return total + (service.duree || 0); // Supposons que chaque service a une propriété dureeEstimee en minutes
      }, 0);

      console.log('duree total minute = ',dureeTotaleMinutes);

      // 2. Calculer la date de fin
      const dateDebut = new Date(data.date);
      const dateFin = new Date(dateDebut.getTime() + dureeTotaleMinutes * 60000);

      // 3. Trouver un mécanicien disponible sur cette plage
      const mecanicienLibre = await userService.findMecanicienLibreByDateRange(dateDebut, dateFin);

      if (mecanicienLibre.nombre === 0) {
        throw new Error("Aucun mécanicien disponible pour la plage horaire demandée");
      }

      // 4. Assigner le premier mécanicien disponible et créer le rendez-vous
      data.userMecanicienId = mecanicienLibre.mecaniciens[0]._id.toString();
      const rendezVous = await RendezVous.create(data);

      return rendezVous;
    } catch (error) {
      console.error("Erreur dans genererRendezVousAvecSuggestion:", error);
      throw error; // Propager l'erreur pour la gérer dans le controller
    }
  }

  // async genererRendezVousAvecSuggestion(rendezVousData) {
  //   try {
  //     const userService = require("../services/user.service");
  //     const date = rendezVousData.date;
  //     const mecanicienLibre = await userService.findMecanicienLibreByDate(date);
  //     if (mecanicienLibre.nombre > 0) {
  //       var mecanicienId = mecanicienLibre.mecaniciens[0]._id;
  //       rendezVousData.userMecanicientId = mecanicienId.toString();
  //       const rendezVous = await RendezVous.create(rendezVousData);
  //       return rendezVous;
  //     } else {
  //       throw new Error("Aucun Mecanicien Libre pour votre Date")
  //       // const message = "Aucun Mecanicien Libre pour votre Date";
  //       // return message;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }

  async fetchPlannings() {
    try {
      const rendezVous = await RendezVous.find()
        .populate("userClientId", "name") // Récupérer seulement le nom du client
        .populate("services.serviceId", "duree"); // Récupérer la durée des services

      return rendezVous.map((rdv) => {
        const start = new Date(rdv.date);

        let totalDuration = rdv.services.reduce(
          (sum, service) => sum + (service.serviceId?.duration || 0),
          0
        );

        const end = new Date(start.getTime() + totalDuration * 60000); // Convertir minutes en millisecondes

        return {
          id: rdv._id,
          name: rdv.userClientId?.name || "Client inconnu",
          status: rdv.statut,
          start,
          end,
          statusClass: this.mapStatusClass(rdv.statut),
        };
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des plannings :", error);
      throw error;
    }
  }

  mapStatusClass(status) {
    switch (status) {
      case "confirmé":
        return "success";
      case "annulé":
        return "danger";
      default:
        return "warning";
    }
  }

  async getDetail(rendezvousId) {
    try {
      console.log("Début de getDetail avec rendezvousId:", rendezvousId);

      const data = await RendezVous.findOne({ _id: rendezvousId })
        .populate("userClientId", "-password")
        .populate("userMecanicientId", "-password")
        .populate({
          path: "services.serviceId",
          model: "Service",
        })
        .exec();

      let duration = 0;

      for (let i = 0; i < data.services.length; i++) {
        duration += data.services[i].serviceId.duree;
      }

      if (!data) {
        console.log("Aucun rendez-vous trouvé avec cet ID.");
        return null;
      }

      const appointment = {
        _id: data._id,
        name: data.nom || undefined,
        client: data.userClientId,
        description: data.description || undefined,
        start: data.date,
        serviceTime: duration,
        status: data.statut,
        mechanical: data.userMecanicientId,
        services: data.services
          ? data.services.map((s) => ({
              _id: s.serviceId._id,
              nom: s.serviceId.nom,
              prix: s.serviceId.prix,
              duree: s.serviceId.duree,
              description: s.serviceId.description
            }))
          : [],
      };

      return appointment;
    } catch (error) {
      console.error("Erreur lors de la récupération du rendez-vous:", error);
      throw new Error(
        `Erreur lors de la récupération du rendez-vous: ${error.message}`
      );
    }
  }
}

module.exports = new RendezVousService();
