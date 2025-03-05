const express = require("express");
const router = express.Router();
const Manager = require("../models/Manager");

// Créer un manager
router.post("/", async (req, res) => {
  try {
    const manager = new Manager(req.body);
    await manager.save();
    res.status(201).json(manager);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lire tous les managers
router.get("/", async (req, res) => {
  try {
    const managers = await Manager.find();
    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour un manager
router.put("/:id", async (req, res) => {
  try {
    const manager = await Manager.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(manager);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer un manager
router.delete("/:id", async (req, res) => {
  try {
    await Manager.findByIdAndDelete(req.params.id);
    res.json({ message: "Manager supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
