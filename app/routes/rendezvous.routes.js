const express = require('express');
const { creerRendezVous, getRendezVousParClient, annulerRendezVous } = require('../controllers/rendezvous.controller');

const router = express.Router();

router.post('/rendezvous', creerRendezVous); // Créer un rendez-vous
router.get('/rendezvous/client/:clientId', getRendezVousParClient); // Voir les rendez-vous d'un client
router.put('/rendezvous/:rendezVousId/annuler', annulerRendezVous); // Annuler un rendez-vous

module.exports = router;