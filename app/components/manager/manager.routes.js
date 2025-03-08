const express = require('express');
const router = express.Router();
const managerController = require('./manager.controller');

router.post('/', managerController.create);
router.get('/', managerController.getById);
router.put('/:id', managerController.update);
router.delete('/:id', managerController.delete);

module.exports = router;
