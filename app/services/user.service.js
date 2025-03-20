const User = require('../models/user.model');
const logger = require('../../utils/logger');

// Créer un utilisateur
exports.createUser = async (userData) => {
    logger.info(`Création d'un utilisateur avec les données: ${JSON.stringify(userData)}`);
    const user = new User(userData);
    return await user.save();
};

// Créer un utilisateur
exports.getUserById = async (userid) => {
    logger.info(`Création d'un utilisateur avec les données: ${JSON.stringify(userData)}`);
    const user = User.find({ where : { _id_: userid }})
    return user;
};

// Lire tous les utilisateurs
exports.getUsers = async () => {
    logger.info('Récupération de tous les utilisateurs');
    return User.find();
};

// Mettre à jour un utilisateur
exports.updateUser = async (id, userData) => {
    logger.info(`Mise à jour de l'utilisateur avec ID: ${id}`);
    return User.findByIdAndUpdate(id, userData, { new: true });
};

// Supprimer un utilisateur
exports.deleteUser = async (id) => {
    logger.info(`Suppression de l'utilisateur avec ID: ${id}...`);
    return User.findByIdAndDelete(id);
};

// Mecanicien
exports.findMecanicien = async () => {
    logger.info(`Création d'un utilisateur avec les données: ${JSON.stringify(userData)}`);
    const user = User.find({ where : { role : "mechanic" }})
    return user;
};

exports.findClient = async () => {
    logger.info(`Création d'un utilisateur avec les données: ${JSON.stringify(userData)}`);
    const user = User.find({ where : { role : "client" }})
    return user;
};

exports.findManager = async () => {
    logger.info(`Création d'un utilisateur avec les données: ${JSON.stringify(userData)}`);
    const user = User.find({ where : { role : "manager" }})
    return user;
};