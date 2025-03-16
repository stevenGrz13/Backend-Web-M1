const RendezVous = require('../models/rendezvous.model');
const Client = require('../models/client.model');

class RendezVousService {
    async findAll() {
        const listeRendezVous = await RendezVous.find();
        console.log("============================");
        console.log("============================");
        for(let i=0; i<listeRendezVous.length; i++){
            console.log(listeRendezVous[i].client);
            console.log(listeRendezVous[i].date);
            console.log(listeRendezVous[i].heure);
            console.log(listeRendezVous[i].description);
            console.log(listeRendezVous[i].idVehicule);
            console.log(listeRendezVous[i].idMechanicien);
            console.log(listeRendezVous[i].statut);
        }
        console.log("============================");
        console.log("============================");
        return listeRendezVous;
    }
    
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
