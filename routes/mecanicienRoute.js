const express = require("express");
const router = express.Router();
const Mecanicien = require("../models/Mecanicien");

// Créer un mécanicien
router.post("/", async (req, res) => {
  try {
    const mecanicien = new Mecanicien(req.body);
    await mecanicien.save();
    res.status(201).json(mecanicien);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lire tous les mécaniciens
router.get("/", async (req, res) => {
  try {
    const mecaniciens = await Mecanicien.find();
    res.json(mecaniciens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour un mécanicien
router.put("/:id", async (req, res) => {
  try {
    const mecanicien = await Mecanicien.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(mecanicien);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer un mécanicien
router.delete("/:id", async (req, res) => {
  try {
    await Mecanicien.findByIdAndDelete(req.params.id);
    res.json({ message: "Mécanicien supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
