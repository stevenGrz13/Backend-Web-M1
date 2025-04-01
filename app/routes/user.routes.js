// src/components/user/user.routes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../../middleware/auth');

// router.post('/', authMiddleware, userController.create);
// router.get('/:id', authMiddleware, userController.getById);
// router.get('/', authMiddleware, userController.getAll);
// router.put('/:id', authMiddleware, userController.update);
// router.delete('/:id', authMiddleware, userController.delete);

router.get('/nombremecanicien', userController.getNombreMecanicien);
router.get('/clients', userController.getClients);
router.post('/mecanicienlibrebydate', userController.getMecanicienLibreByDate);
router.post('/allbyrole', userController.getUsersByRole);
router.post('/', userController.create.bind(userController));
router.get('/', userController.getAllPaginate.bind(userController));
router.get('/:id', userController.getById.bind(userController));
router.put('/:id', userController.update.bind(userController));
router.delete('/:id', userController.delete.bind(userController));

// IDENTIFICATION
router.post('/login', userController.LogIn);

module.exports = router;
