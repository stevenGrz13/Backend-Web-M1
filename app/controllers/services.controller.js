const serviceService = require('../services/services.service');
const CrudController = require("../core/controllers/crud.controller");

class ServiceController extends CrudController {
    constructor() {
        super(serviceService);
    }

    async findServiceRupture(req, res) {
        try {
            const service = await serviceService.findEmptyService();
            res.status(201).json(service);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la recherche des services en rupture de stock", error: error.message });
        }
    }

    async createService(req, res) {
        try {
            const service = await serviceService.createService(req.body);
            res.status(201).json(service);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création du service", error: error.message });
        }
    }

    async getServices(req, res) {
        try {
            const services = await serviceService.getServices();
            res.status(200).json(services);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des services", error: error.message });
        }
    }

    async updateService(req, res) {
        try {
            const updatedService = await serviceService.updateService(req.params.id, req.body);
            if (!updatedService) {
                return res.status(404).json({ message: "Service non trouvé" });
            }
            res.status(200).json(updatedService);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour du service", error: error.message });
        }
    }

    async deleteService(req, res) {
        try {
            const deletedService = await serviceService.deleteService(req.params.id);
            if (!deletedService) {
                return res.status(404).json({ message: "Service non trouvé" });
            }
            res.status(200).json({ message: "Service supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression du service", error: error.message });
        }
    }
}

module.exports = new ServiceController();
