const express = require('express');
const rendezVousController = require('../controllers/rendezvous.controller');

const router = express.Router();

router.post('/', rendezVousController.create.bind(rendezVousController)); 
router.get('/client/:clientId', rendezVousController.getRendezVousParClient); 
router.get('/mechanic/:mechanicienId', rendezVousController.getRendezVousParMecanicien);
router.get('/getNombreRdv', rendezVousController.getNombreRdv);
router.get('/', rendezVousController.getAllPaginate.bind(rendezVousController)); 
router.get('/:id', rendezVousController.getById.bind(rendezVousController)); 
router.put('/:rendezVousId/annuler', rendezVousController.annulerRendezVous); 
router.put('/:id', rendezVousController.update.bind(rendezVousController));
router.delete('/:id', rendezVousController.delete.bind(rendezVousController));

module.exports = router;