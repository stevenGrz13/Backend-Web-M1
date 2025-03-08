const express = require('express');
const router = express.Router();
const clientController = require('./client.controller');

router.post('/', clientController.createClient);
router.get('/', clientController.getClients);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;
