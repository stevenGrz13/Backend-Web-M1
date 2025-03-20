const RendezVous = require('../models/rendezvous.model');
const Client = require('../models/user.model');

class RendezVousService {
    async findAll() {
        const listeRendezVous = await RendezVous.find();
        return listeRendezVous;
    }

    async creerRendezVous(data) {
        // Extraire les données du body de la requête
        const { userClientId, userMecanicientId, date, heure, description, vehiculeId, statut, services, pieces } = data;

        // Vérifier si les utilisateurs existent
        const clientExiste = await Client.findById(userClientId); // Utiliser userClientId et non clientId
        if (!clientExiste) throw new Error("Client non trouvé");

        const mecanicienExiste = await Client.findById(userMecanicientId); // Vérifier également si le mécanicien existe
        if (!mecanicienExiste) throw new Error("Mécanicien non trouvé");

        // Créer le rendez-vous
        const rendezVous = new RendezVous({
            userClientId, 
            userMecanicientId, 
            date, 
            heure, 
            description, 
            vehiculeId, 
            statut, 
            services, 
            pieces
        });

        // Sauvegarder dans la base de données
        await rendezVous.save();
        return rendezVous;
    }

    async getRendezVousParClient(clientId) {
        return await RendezVous.find({ userClientId: clientId }).populate('userClientId', 'nom prenom courriel');
    }

    async annulerRendezVous(rendezVousId) {
        return await RendezVous.findByIdAndUpdate(rendezVousId, { statut: 'annulé' }, { new: true });
    }
}

module.exports = new RendezVousService();
