const mongoose = require("mongoose");

const FactureSchema = new mongoose.Schema(
  {
    userClientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    interventionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Intervention",
      required: true,
    },
    date: { type: Date, required: true },
    vehiculeId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    services: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        prix: {
          type: Number,
          required: true,
          min: 0,
          get: (value) => value.toFixed(2),
          set: (value) => parseFloat(value).toFixed(2),
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
        prix: {
          type: Number,
          required: true,
          min: 0,
          get: (value) => value.toFixed(2),
          set: (value) => parseFloat(value).toFixed(2),
        },
      },
    ],

    statut: {
      type: String,
      enum: ["non payee", "payee"],
      default: "non payee",
    },

    total: {
      type: Number, // comment faire pour que ceci soit deux chiffres apres virgules?
      default: 0,
      get: (value) => value.toFixed(2),
      set: (value) => parseFloat(value).toFixed(2),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Facture", FactureSchema);
