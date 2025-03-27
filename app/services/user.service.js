const User = require("../models/user.model");
const CrudService = require("../core/services/crud.service");
const roleService = require("../services/role.service");

class UserService extends CrudService{
  constructor(){
    super(User);
  }

  async findNombreByRole(role) {
    const user = await roleService.findRole(role);
    console.log('user',user);
    return { nombre: user.length };
  };

  async LogIn(email, password, roleId) {
    if (!email || !password || !roleId) {
      throw new Error("Tous les champs sont requis.");
    }
    const user = await User.findOne({ email, password, roleId });
    if (!user) {
      throw new Error("Aucun utilisateur trouvé avec ces informations.");
    }
    return user;
  };
  
}

module.exports = new UserService();