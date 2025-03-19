const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prix: {
      type: Number,
      get: (value) => value.toFixed(2),
      set: (value) => parseFloat(value).toFixed(2),
      required: true,
    },
    description: { type: String, required: true },
    duree: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
