const Client = require('../models/client.model');
const logger = require('../../utils/logger')

// Créer un article
exports.createClient = async (articleData) => {
    logger.info(`Création d'un article avec les données: ${JSON.stringify(articleData)}`);
    const article = new Client(articleData);
    return await article.save();
};

// Lire tous les articles
exports.getClients = async () => {
    logger.info('Récupération de tous les articles');
    return Client.find();
};

// Mettre à jour un article
exports.updateClient = async (id, articleData) => {
    logger.info(`Mise à jour de l'article avec ID: ${id}`);
    return Client.findByIdAndUpdate(id, articleData, {new: true});
};

// Supprimer un article
exports.deleteClient = async (id) => {
    logger.info(`Suppression de l'article avec ID: ${id}...`);
    return Client.findByIdAndDelete(id);
};
