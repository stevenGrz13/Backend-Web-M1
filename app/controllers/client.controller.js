const clientService = require('../services/client.service');
const CrudController = require("../core/controllers/crud.controller");
class ClientController extends CrudController {
    constructor() {
        super(clientService);
    }

    async createClient(req, res) {
        try {
            console.log("MIANTSO ANLE CREATE CLIENT LERY");
            const client = await clientService.createClient(req.body);
            res.status(201).json(client);
            console.log("IO FA MIDINA");
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création du client", error: error.message });
        }
    }

    async getClients(req, res) {
        try {
            const clients = await clientService.getClients();
            res.status(200).json(clients);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des clients", error: error.message });
        }
    }

    async updateClient(req, res) {
        try {
            const updatedClient = await clientService.updateClient(req.params.id, req.body);
            if (!updatedClient) {
                return res.status(404).json({ message: "Client non trouvé" });
            }
            res.status(200).json(updatedClient);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour du client", error: error.message });
        }
    }

    async deleteClient(req, res) {
        try {
            const deletedClient = await clientService.deleteClient(req.params.id);
            if (!deletedClient) {
                return res.status(404).json({ message: "Client non trouvé" });
            }
            res.status(200).json({ message: "Client supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression du client", error: error.message });
        }
    }
}

module.exports = new ClientController();
