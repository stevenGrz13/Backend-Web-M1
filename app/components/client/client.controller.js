const clientService = require('./client.service');
const logger = require('../../../utils/logger')

class ClientController{

    // Créer un client
    async createClient(req, res, next)  {
        try {
            const client = await clientService.createClient(req.body);
            logger.info(`Client créé avec succès: ${client.nom} ${client.prenom}`);
            res.status(201).json(client);
        } catch (error) {
            next(error)
            logger.error(`Erreur lors de la création de l'client: ${error.message}`);
            res.status(400).json({ message: error.message });
        }
    };

// Lire tous les clients
    async getClients (req, res) {
        try {
            const clients = await clientService.getClients();
            logger.info(`Nombre d'clients récupérés: ${clients.length}`);
            res.json(clients);
        } catch (error) {
            logger.error(`Erreur lors de la récupération des clients: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    };

// Mettre à jour un client
    async updateClient (req, res) {
        try {
            const client = await clientService.updateClient(req.params.id, req.body);
            logger.info(`Client mis à jour: ${client.title}`);
            res.json(client);
        } catch (error) {
            logger.error(`Erreur lors de la mise à jour de le client: ${error.message}`);
            res.status(400).json({ message: error.message });
        }
    };

// Supprimer un client
    async deleteClient(req, res) {
        try {
            await clientService.deleteClient(req.params.id);
            logger.info(`Client supprimé avec succès`);
            res.json({ message: "Client supprimé" });
        } catch (error) {
            logger.error(`Erreur lors de la suppression de le client: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    };
}

module.exports = new ClientController()
