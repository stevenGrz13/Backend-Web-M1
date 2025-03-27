const Service = require('../models/service.model');
const logger = require('../../utils/logger');

exports.findEmptyService = async (articleData) => {
    logger.info(`Création d'un service avec les données: ${JSON.stringify(articleData)}`);
    const liste = await Service.find({ quantite : 0 });
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
exports.getServices = async ({ page = 1, limit = 10 }) => {

    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
        Service.find().skip(skip).limit(limit),
        Service.countDocuments()
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    const data = {
        services,
        pagination: {
            total,
            totalPages,
            currentPage: page,
            hasNext,
            hasPrev,
            limit
        }
    };
    logger.info(`Récupération de tous les services, ${data}`);

    return data
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
