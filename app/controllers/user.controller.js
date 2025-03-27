const userService = require("../services/user.service");
const CrudController = require("../core/controllers/crud.controller");
const ApiResponse = require("../core/response.model");
const { RoleType } = require("../core/roletype.model");
class UserController extends CrudController {
  constructor() {
    super(userService);
  }

  async getNombreMecanicien(req, res) {
    try {
      const users = await userService.findNombreByRole(RoleType.MECHANIC);
      new ApiResponse(200, users, "Document got successfully").send(res);
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération des utilisateurs",
        error: error.message,
      });
    }
  }

  // IDENTIFICATION

  async LogIn(req, res) {
    try {
      const { email, password, roleId } = req.body;
      if (!email || !password || !roleId) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
      }

      const user = await userService.LogIn(email, password, roleId);

      if (!user) {
        return res.status(401).json({ message: "Identifiants incorrects" });
      }

      const { password: _, ...userWithoutPassword } = user.toObject();

      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({
        message: "Erreur lors de l'identification",
        error: error.message,
      });
    }
  }
}

module.exports = new UserController();
