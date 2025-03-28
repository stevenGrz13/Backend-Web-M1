// src/components/vehicle/routes/vehicle.routes.js

const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const authMiddleware = require('../../middleware/auth');

router.post('/', vehicleController.create.bind(vehicleController));
router.get('/:id', vehicleController.getById.bind(vehicleController));
router.get('/', vehicleController.getAllPaginate.bind(vehicleController));
router.get('/client/:clientId', vehicleController.getByClientId);
router.put('/:id', vehicleController.update.bind(vehicleController));
router.delete('/:id', vehicleController.delete.bind(vehicleController));

// router.post('/', authMiddleware, vehicleController.create);
// router.get('/:id', authMiddleware, vehicleController.getById);
// router.get('/client/:clientId', authMiddleware, vehicleController.getByClientId);
// router.put('/:id', authMiddleware, vehicleController.update);
// router.delete('/:id', authMiddleware, vehicleController.delete);

module.exports = router;
