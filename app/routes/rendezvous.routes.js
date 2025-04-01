const express = require('express');
const rendezVousController = require('../controllers/rendezvous.controller');

const router = express.Router();

router.get('/info', rendezVousController.getInfos);
// router.get('/:id/details', rendezVousController.getInfos);
router.post('/', rendezVousController.genererRendezVousAvecSuggestion);
router.get('/client/:clientId', rendezVousController.getRendezVousParClient);
router.get('/mechanic/:mechanicienId', rendezVousController.getRendezVousParMecanicien);
router.get('/getNombreRdv', rendezVousController.getNombreRdv);
router.get('/', rendezVousController.getAllPaginate.bind(rendezVousController));
router.get('/:id', rendezVousController.getById.bind(rendezVousController));
router.put('/annuler/:rendezVousId', rendezVousController.annulerRendezVous);
router.post('/confirmer/:rendezVousId', rendezVousController.confirmerRendezVous);
router.put('/:id', rendezVousController.update.bind(rendezVousController));
router.delete('/:id', rendezVousController.delete.bind(rendezVousController));

module.exports = router;
