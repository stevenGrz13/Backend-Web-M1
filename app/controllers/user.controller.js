const userService = require("../services/user.service");
const rendezVousService = require("../services/rendezvous.service");
class UserController {
  constructor() {}

  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Erreur lors de la création de l'utilisateur",
          error: error.message,
        });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await userService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Erreur lors de la récupération des utilisateurs",
          error: error.message,
        });
    }
  }

  async getNombreMecanicien(req, res) {
    try {
      const users = await userService.findNombreMecanicien();
      res.status(200).json(users);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Erreur lors de la récupération des utilisateurs",
          error: error.message,
        });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.userid);
      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Erreur lors de la récupération de l'utilisateur",
          error: error.message,
        });
    }
  }

  async updateUser(req, res) {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Erreur lors de la mise à jour de l'utilisateur",
          error: error.message,
        });
    }
  }

  async deleteUser(req, res) {
    try {
      const deletedUser = await userService.deleteUser(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Erreur lors de la suppression de l'utilisateur",
          error: error.message,
        });
    }
  }

  // IDENTIFICATION

  async LogIn(req, res) {
    try {
      const { email, password, role } = req.body;

      if (!email || !password || !role) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
      }

      const user = await userService.LogIn(email, password, role);

      if (!user) {
        return res.status(401).json({ message: "Identifiants incorrects" });
      }

      const { password: _, ...userWithoutPassword } = user.toObject();

      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "Erreur lors de l'identification",
          error: error.message,
        });
    }
  }
}

module.exports = new UserController();
