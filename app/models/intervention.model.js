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
        etat: { type: Boolean, default: false }
      },
    ],

    status: {
      type: String,
      enum: ["en cours", "facturee", "terminee", "en attente"],
      required: true,
    },

    avancement: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      set: (v) => parseFloat(v.toFixed(2)),
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Intervention", interventionSchema);
