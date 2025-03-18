const express = require('express');
const router = express.Router();
const pieceController = require('../controllers/piece.controller');

router.post('/', pieceController.createPiece);
router.get('/', pieceController.getPieces);
router.put('/:id', pieceController.updatePiece);
router.delete('/:id', pieceController.deletePiece);

router.get('/findPieceRupture', pieceController.findPieceRupture);

module.exports = router;
