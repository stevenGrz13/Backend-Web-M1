const RendezVous = require('../models/rendezvous.model');
const Client = require('../models/client.model');

class RendezVousService {
    async creerRendezVous(clientId, date, heure, description) {
        // Vérifier si le client existe
        const clientExiste = await Client.findById(clientId);
        if (!clientExiste) throw new Error("Client non trouvé");

        // Créer le rendez-vous
        const rendezVous = new RendezVous({ client: clientId, date, heure, description });
        await rendezVous.save();
        return rendezVous;
    }

    async getRendezVousParClient(clientId) {
        return await RendezVous.find({ client: clientId }).populate('client', 'nom prenom courriel');
    }

    async annulerRendezVous(rendezVousId) {
        return await RendezVous.findByIdAndUpdate(rendezVousId, { statut: 'annulé' }, { new: true });
    }
}

module.exports = new RendezVousService();
