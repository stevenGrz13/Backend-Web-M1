const express = require('express');
const router = express.Router();
const factureController = require('../controllers/facture.controller');

router.post('/', factureController.create.bind(factureController));
router.get('/', factureController.getAllPaginate.bind(factureController));
router.put('/:id', factureController.update.bind(factureController));
router.delete('/:id', factureController.delete.bind(factureController));

module.exports = router;