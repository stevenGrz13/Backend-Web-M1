const mongoose = require("mongoose");

const interventionSchema = new mongoose.Schema(
  {
    rendezVousId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RendezVous",
      required: true,
    },

    services: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        etat: { type: String, enum: ["en cours", "fini"], default: "en cours" }, // État du service
      },
    ],

    pieces: [
      {
        pieceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Piece",
          required: true,
        },
        quantite: { type: Number, required: true, min: 1 }, // Quantité utilisée
      },
    ],

    status: {
      type: String,
      enum: ["en cours", "facturee", "terminee"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Intervention", interventionSchema);
