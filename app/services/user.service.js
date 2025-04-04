const User = require("../models/user.model");
const RendezVous = require("../models/rendezvous.model");
const CrudService = require("../core/services/crud.service");
const roleService = require("../services/role.service");
const rendezVousService = require("../services/rendezvous.service");
const RoleType = require("../core/roletype.model");
const logger = require("../../utils/logger");

class UserService extends CrudService {
  constructor() {
    super(User);
  }

  async findMecanicienLibreByDateRange(dateDebut, dateFin) {
    try {
      const roleMechanic = await roleService.findRole('mechanic');
      // 1. Trouver les mécaniciens occupés
      const occupiedMechanics = await RendezVous.aggregate([
        // Étape 1: Jointure avec les services
        {
          $lookup: {
            from: "services",
            localField: "services.serviceId",
            foreignField: "_id",
            as: "servicesDetails"
          }
        },
        // Étape 2: Calcul durée totale
        {
          $addFields: {
            totalDureeMinutes: { $sum: "$servicesDetails.duree" }
          }
        },
        // Étape 3: Calcul date de fin
        {
          $addFields: {
            dateEnd: {
              $add: ["$date", { $multiply: ["$totalDureeMinutes", 60000] }]
            }
          }
        },
        // Étape 4: Filtrage des chevauchements
        {
          $match: {
            $or: [
              { $and: [{ date: { $lte: dateDebut }}, { dateEnd: { $gte: dateDebut } }] },
              { $and: [{ date: { $lte: dateFin }}, { dateEnd: { $gte: dateFin } }] },
              { $and: [{ date: { $gte: dateDebut }}, { dateEnd: { $lte: dateFin } }] }
            ]
          }
        },
        // Étape 5: Garder seulement les IDs des mécaniciens occupés
        { $group: { _id: "$userMecanicientId" } }
      ]);

      // 2. Extraire les IDs des mécaniciens occupés
      const occupiedMechanicIds = occupiedMechanics.map(m => m._id);

      // 3. Trouver les mécaniciens disponibles (non occupés)
      const availableMechanics = await User.find({
        roleId: roleMechanic[0]._id,
        _id: { $nin: occupiedMechanicIds }
      }).lean();

      return {
        nombre: availableMechanics.length,
        mecaniciens: availableMechanics
      };
    } catch (error) {
      console.error("Erreur dans findMecanicienLibreByDateRange:", error);
      throw error;
    }
  }

  // async findMecanicienLibreByDateRange(dateDebut, dateFin) {
  //   const mecaniciensDispo = [];
  //   const mecaniciens = await this.findAllByRole("mechanic");
  //
  //   for (const mecanicien of mecaniciens.users) {
  //     const listeRdv = await RendezVous.find({
  //       userMecanicientId: mecanicien._id,
  //       date: { $gte: dateDebut, $lte: dateFin },
  //     });
  //
  //     if (listeRdv.length === 0) {
  //       mecaniciensDispo.push(mecanicien);
  //     }
  //   }
  //
  //   return {
  //     nombre: mecaniciensDispo.length,
  //     mecaniciens: mecaniciensDispo,
  //   };
  // }

  // async findMecanicienLibreByDate(date) {
  //   const listeRendezVous = await rendezVousService.findRendezVousByDate(date);
  //
  //   let mecaniciensOccupes = new Set();
  //
  //   for (const rdv of listeRendezVous) {
  //     let duration = rdv.services.reduce(
  //       (acc, service) => acc + service.serviceId.duree,
  //       0
  //     );
  //
  //     const dateDebut = new Date(rdv.date);
  //     const dateFin = new Date(dateDebut.getTime() + duration * 60000);
  //
  //     const dateTest = new Date(date);
  //
  //     if (dateTest >= dateDebut && dateTest <= dateFin) {
  //       mecaniciensOccupes.add(rdv.userMecanicientId.toString());
  //     }
  //   }
  //
  //   const mechanics = await this.findAllByRole(RoleType.RoleType.MECHANIC);
  //
  //   const availableMechanics = mechanics.users.filter(
  //     (mechanic) => !mecaniciensOccupes.has(mechanic._id.toString())
  //   );
  //
  //   return {
  //     nombre: availableMechanics.length,
  //     mecaniciens: availableMechanics,
  //   };
  // }

  async findNombreByRole(role) {
    const users = await this.findAllByRole(role);
    return { nombre: users.users.length };
  }

  async findAllByRole(role) {
    const roleentity = await roleService.findRole(role);
    const users = await User.find({ roleId: roleentity[0]._id.toString() });
    return { users };
  }

  async findAllPaginateByRole(role, { page = 1, limit = 10 }) {
    let dataResponse = {};
    logger.info(`Récupération de tous les elements...`);
    const skip = (page - 1) * limit;

    const roles = await roleService.findRole(role);

    const [data, total] = await Promise.all([
      User.find({ roleId: roles[0]._id.toString() }).skip(skip).limit(limit),
      User.countDocuments({ roleId: roles[0]._id.toString() }),
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
  }

  async LogIn(email, password, roleId) {
    if (!email || !password || !roleId) {
      throw new Error("Tous les champs sont requis.");
    }

    const user = await User.findOne({ email, password, roleId }).populate(
      "roleId",
      "nom _id"
    );
    // console.log("user = ", user)
    if (!user) {
      // console.log("error")
      throw new Error("Aucun utilisateur trouvé avec ces informations.");
    }
    return user;
  }
}

module.exports = new UserService();
