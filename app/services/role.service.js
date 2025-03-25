const Role = require('../models/role.model');
const logger = require('../../utils/logger');

// Créer un rôle
exports.createRole = async (roleData) => {
    logger.info(`Création d'un rôle avec les données: ${JSON.stringify(roleData)}`);
    const role = new Role(roleData);
    return await role.save();
};

// Lire tous les rôles
exports.getRoles = async () => {
    logger.info('Récupération de tous les rôles');
    return Role.find();
};

// Mettre à jour un rôle
exports.updateRole = async (id, roleData) => {
    logger.info(`Mise à jour du rôle avec ID: ${id}`);
    return Role.findByIdAndUpdate(id, roleData, { new: true });
};

// Supprimer un rôle
exports.deleteRole = async (id) => {
    logger.info(`Suppression du rôle avec ID: ${id}...`);
    return Role.findByIdAndDelete(id);
};