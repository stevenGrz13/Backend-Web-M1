const mongoose = require("mongoose");

const RendezVousSchema = new mongoose.Schema(
  {
    userClientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userMecanicientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    heure: { type: String, required: true },
    description: { type: String },
    vehiculeId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    statut: {
      type: String,
      enum: ["en attente", "confirmé", "annulé"],
      default: "en attente",
    },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    pieces: [
      {
        piece: { type: mongoose.Schema.Types.ObjectId, ref: "Piece" },
        quantite: { type: Number, required: true, default: 1 }, // Nombre de pièces
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("RendezVous", RendezVousSchema);
