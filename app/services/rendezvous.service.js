const RendezVous = require("../models/rendezvous.model");
const Client = require("../models/user.model");
const Piece = require("../models/piece.model");
class RendezVousService {
  async findAll() {
    const listeRendezVous = await RendezVous.find();
    return listeRendezVous;
  }

  async creerRendezVous(data) {
    const {
      userClientId,
      userMecanicientId,
      date,
      description,
      vehiculeId,
      statut,
      services,
      pieces,
    } = data;

    const clientExiste = await Client.findById(userClientId);
    if (!clientExiste) throw new Error("Client non trouvé");

    const mecanicienExiste = await Client.findById(userMecanicientId);
    if (!mecanicienExiste) throw new Error("Mécanicien non trouvé");

    for (const item of pieces) {
      const piece = await Piece.findById(item.piece);
      if (!piece) throw new Error(`Pièce non trouvée : ${item.piece}`);

      if (piece.quantite < item.quantite) {
        throw new Error(
          `Stock insuffisant pour la pièce ${piece.nom}. Disponible: ${piece.quantite}, Requis: ${item.quantite}`
        );
      }
    }

    for (const item of pieces) {
      await Piece.findByIdAndUpdate(item.piece, {
        $inc: { quantite: -item.quantite },
      });
    }

    const rendezVous = new RendezVous({
      userClientId,
      userMecanicientId,
      date,
      description,
      vehiculeId,
      statut,
      services,
      pieces,
    });

    await rendezVous.save();
    return rendezVous;
  }

  async updateRendezVous(rendezVousId, etat) {
    const rendezVous = await RendezVous.find({ _id: rendezVousId });
    rendezVous.statut = etat;
    await RendezVous.updateOne(rendezVousId, rendezVous);
    await rendezVous.save();
    return rendezVous;
  }

  async getRendezVousParClient(clientId) {
    return await RendezVous.find({ userClientId: clientId }).populate(
      "userClientId",
      "nom prenom courriel"
    );
  }

  async getRendezVousParMecanicien(mecanicienId) {
    return await RendezVous.find({ userMecanicientId: mecanicienId }).populate(
      "mecanicienId",
      "nom prenom courriel"
    );
  }

  async annulerRendezVous(rendezVousId) {
    return await RendezVous.findByIdAndUpdate(
      rendezVousId,
      { statut: "annulé" },
      { new: true }
    );
  }
}

module.exports = new RendezVousService();
