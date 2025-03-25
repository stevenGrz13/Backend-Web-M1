const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", RoleSchema);
