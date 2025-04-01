const User = require("../models/user.model");
const CrudService = require("../core/services/crud.service");
const roleService = require("../services/role.service");
const rendezVousService = require("../services/rendezvous.service");
const RoleType = require("../core/roletype.model");

class UserService extends CrudService {
  constructor() {
    super(User);
  }

  async findMecanicienLibreByDate(date) {
    const listeRendezVous = await rendezVousService.findRendezVousByDate(date);

    let mecaniciensOccupes = new Set();

    for (const rdv of listeRendezVous) {
      let duration = rdv.services.reduce(
        (acc, service) => acc + service.serviceId.duree,
        0
      );

      const dateDebut = new Date(rdv.date);
      const dateFin = new Date(dateDebut.getTime() + duration * 60000);

      const dateTest = new Date(date);

      if (dateTest >= dateDebut && dateTest <= dateFin) {
        mecaniciensOccupes.add(rdv.userMecanicientId.toString());
      }
    }

    const mechanics = await this.findAllByRole(RoleType.RoleType.MECHANIC);

    const availableMechanics = mechanics.users.filter(
      (mechanic) => !mecaniciensOccupes.has(mechanic._id.toString())
    );

    return {
      nombre: availableMechanics.length,
      mecaniciens: availableMechanics,
    };
  }

  async findNombreByRole(role) {
    const users = await this.findAllByRole(role);
    return { nombre: users.users.length };
  }

  async findAllByRole(role) {
    const roleentity = await roleService.findRole(role);
    const users = await User.find({ roleId: roleentity[0]._id.toString() });
    return { users };
  }

  async LogIn(email, password, roleId) {
    if (!email || !password || !roleId) {
      throw new Error("Tous les champs sont requis.");
    }

    const user = await User.findOne({ email, password, roleId })
        .populate('roleId', 'nom _id');
    console.log("user = ", user)
    if (!user) {
      // console.log("error")
      throw new Error("Aucun utilisateur trouvé avec ces informations.");
    }
    return user;
  }
}

module.exports = new UserService();
