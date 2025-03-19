const mongoose = require("mongoose");

const PieceSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prixunitaire: {
      type: Number,
      get: (value) => value.toFixed(2),
      set: (value) => parseFloat(value).toFixed(2),
      required: true,
    },
    quantite: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Piece", PieceSchema);
