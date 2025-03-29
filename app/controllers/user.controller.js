const userService = require("../services/user.service");
const CrudController = require("../core/controllers/crud.controller");
const ApiResponse = require("../core/response.model");
const { RoleType } = require("../core/roletype.model");
class UserController extends CrudController {
  constructor() {
    super(userService);
  }

  async getUsersByRole(req, res) {
    try {
      const users = await userService.findAllByRole(req.body.role);
      new ApiResponse(200, users, "Get Users By Role Successfull").send(res);
    } catch (error) {
      new ApiResponse(500, null, "Erreur lors de la récupération des users by role").send(res);
    }
  }

  async getNombreMecanicien(req, res) {
    try {
      const users = await userService.findNombreByRole(RoleType.MECHANIC);
      new ApiResponse(200, users.nombre, "Document got successfully").send(res);
    } catch (error) {
      new ApiResponse(500, null, "Erreur lors de la récupération des mecaniciens").send(res);
    }
  }

  async getMecanicienLibreByDate(req, res) {
    try {
      const { date } = req.body;
      const users = await userService.findMecanicienLibreByDate(date);
      new ApiResponse(200, users, "Mecanicien libre get avec succes").send(res);
    } catch (error) {
      new ApiResponse(500, null, "Erreur lors de la récupération des mecaniciens libres").send(res);
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
      new ApiResponse(500, null, "Erreur lors de lu login").send(res);
    }
  }
}

module.exports = new UserController();
