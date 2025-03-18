const RendezVousService = require('../services/rendezvous.service');

const creerRendezVous = async (req, res) => {
    try {
        const { clientId, date, heure, description, idVehicule, idMechanicien, status } = req.body;
        // if (!clientId || !date || !heure || !idVehicule) return res.status(400).json({ message: "Tous les champs sont requis" });

        // const listeRendezVous = await RendezVousService.findAll();

        const rendezVous = await RendezVousService.creerRendezVous(clientId, date, heure, description, idVehicule, idMechanicien, status);
        res.status(201).json({ message: "Rendez-vous créé avec succès", rendezVous });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getNombreRdv = async (req, res) => {
    try {
        const rendezVous = await RendezVousService.findAll();
        res.json({ value : rendezVous.length });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllRdv = async (req, res) => {
    try {
        const rendezVous = await RendezVousService.findAll();
        res.json({ liste : rendezVous });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getRendezVousParClient = async (req, res) => {
    try {
        const { clientId } = req.params;
        const rendezVous = await RendezVousService.getRendezVousParClient(clientId);
        res.json(rendezVous);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const annulerRendezVous = async (req, res) => {
    try {
        const { rendezVousId } = req.params;
        const rendezVous = await RendezVousService.annulerRendezVous(rendezVousId);
        res.json({ message: "Rendez-vous annulé", rendezVous });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { creerRendezVous, getRendezVousParClient, annulerRendezVous, getNombreRdv, getAllRdv };
