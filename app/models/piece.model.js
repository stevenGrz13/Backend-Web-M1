const mongoose = require('mongoose');

const PieceSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    reference: { type: String, required: true },
    quantite: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Piece', PieceSchema);
