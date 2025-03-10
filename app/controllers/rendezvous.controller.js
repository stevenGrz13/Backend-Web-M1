const RendezVousService = require('../services/rendezvous.service');

const creerRendezVous = async (req, res) => {
    try {
        const { clientId, date, heure, description } = req.body;
        if (!clientId || !date || !heure) return res.status(400).json({ message: "Tous les champs sont requis" });

        const rendezVous = await RendezVousService.creerRendezVous(clientId, date, heure, description);
        res.status(201).json({ message: "Rendez-vous créé avec succès", rendezVous });
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

module.exports = { creerRendezVous, getRendezVousParClient, annulerRendezVous };
