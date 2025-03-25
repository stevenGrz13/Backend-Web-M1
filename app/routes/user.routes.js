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

router.post('/', userController.createUser);
router.get('/nombremecanicien', userController.getNombreMecanicien);
router.get('/:id', userController.getUserById);
router.get('/', userController.getUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// IDENTIFICATION
router.post('/login', userController.LogIn);

module.exports = router;
