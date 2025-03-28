const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/services.controller');

router.post('/', serviceController.create.bind(serviceController));
router.get('/', serviceController.getAllPaginate.bind(serviceController));
router.get('/:id', serviceController.getById.bind(serviceController));
router.put('/:id', serviceController.update.bind(serviceController));
router.delete('/:id', serviceController.delete.bind(serviceController));

module.exports = router;