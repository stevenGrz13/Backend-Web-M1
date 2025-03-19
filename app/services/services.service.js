const Service = require('../models/service.model');
const logger = require('../../utils/logger');

exports.findEmptyService = async (articleData) => {
    logger.info(`Création d'un service avec les données: ${JSON.stringify(articleData)}`);
    const liste = await Service.find({ where : { quantite : 0 } });
    return {
        liste : liste,
        nombre : liste.length
    };
};

// Créer un service
exports.createService = async (articleData) => {
    logger.info(`Création d'un service avec les données: ${JSON.stringify(articleData)}`);
    const article = new Service(articleData);
    return await article.save();
};

// Lire tous les services
exports.getServices = async () => {
    logger.info('Récupération de tous les services');
    return Service.find();
};

// Mettre à jour un service
exports.updateService = async (id, articleData) => {
    logger.info(`Mise à jour du service avec ID: ${id}`);
    return Service.findByIdAndUpdate(id, articleData, { new: true });
};

// Supprimer un service
exports.deleteService = async (id) => {
    logger.info(`Suppression du service avec ID: ${id}...`);
    return Service.findByIdAndDelete(id);
};
