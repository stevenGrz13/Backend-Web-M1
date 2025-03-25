// src/components/user/user.model.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true, },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
