const express = require('express');
const { creerRendezVous, getRendezVousParClient, annulerRendezVous, getNombreRdv, getAllRdv } = require('../controllers/rendezvous.controller');

const router = express.Router();

router.post('/', creerRendezVous); // Créer un rendez-vous
router.get('/client/:clientId', getRendezVousParClient); // Voir les rendez-vous d'un client
router.get('/getNombreRdv', getNombreRdv); // Voir les rendez-vous d'un client
router.get('/', getAllRdv); 
router.get('/nombreRendezVous', getNombreRdv); 
router.put('/:rendezVousId/annuler', annulerRendezVous); // Annuler un rendez-vous



module.exports = router;