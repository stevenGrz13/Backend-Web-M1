const roleService = require('../services/role.service');

class RoleController {
    constructor() {
    }

    async createRole(req, res) {
        try {
            const role = await roleService.createRole(req.body);
            res.status(201).json(role);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création du rôle", error: error.message });
        }
    }

    async getRoles(req, res) {
        try {
            const roles = await roleService.getRoles();
            res.status(200).json(roles);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des rôles", error: error.message });
        }
    }

    async updateRole(req, res) {
        try {
            const updatedRole = await roleService.updateRole(req.params.id, req.body);
            if (!updatedRole) {
                return res.status(404).json({ message: "Rôle non trouvé" });
            }
            res.status(200).json(updatedRole);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour du rôle", error: error.message });
        }
    }

    async deleteRole(req, res) {
        try {
            const deletedRole = await roleService.deleteRole(req.params.id);
            if (!deletedRole) {
                return res.status(404).json({ message: "Rôle non trouvé" });
            }
            res.status(200).json({ message: "Rôle supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression du rôle", error: error.message });
        }
    }
}

module.exports = new RoleController();