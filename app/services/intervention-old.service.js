//
//
//
//
//
// async #getRendezVousIds(query) {
//   return RendezVous.find(query).select("_id");
// }
//
// async #getInterventionsWithPagination(rendezVousIds, { page, limit }, sort = {}) {
//   const skip = (page - 1) * limit;
//
//   const [interventions, total] = await Promise.all([
//     Intervention.find({ rendezVousId: { $in: rendezVousIds.map((r) => r._id) } })
//         .sort(sort)
//         .populate(this.#getPopulateOptions())
//         .populate("services.serviceId")
//         .skip(skip)
//         .limit(limit)
//         .lean()
//         .exec(),
//
//     Intervention.countDocuments({ rendezVousId: { $in: rendezVousIds.map((r) => r._id) } })
//   ]);
//
//   return { interventions, total };
// }
//
// #getPopulateOptions() {
//   return {
//     path: "rendezVousId",
//     populate: [
//       {
//         path: "userClientId",
//         model: "User",
//         select: "name firstName email",
//       },
//       {
//         path: "userMecanicientId",
//         model: "User",
//         select: "name firstName email",
//       },
//       { path: "vehiculeId", model: "Vehicle" },
//     ],
//   };
// }
//
// #formatInterventionData(intervention, includeCreatedAt = false) {
//   const estimateTime = intervention.services.reduce((total, serviceItem) => {
//     if (serviceItem.etat === "en cours" && serviceItem.serviceId?.duree) {
//       return total + serviceItem.serviceId.duree;
//     }
//     return total;
//   }, 0);
//
//   const baseData = {
//     _id: intervention._id,
//     client: intervention.rendezVousId?.userClientId,
//     mecanicien: intervention.rendezVousId?.userMecanicientId,
//     vehicle: intervention.rendezVousId?.vehiculeId,
//     status: intervention.status,
//     estimateTime,
//     avancement: intervention.avancement,
//     services: intervention.services.map((s) => ({
//       serviceId: s.serviceId,
//       etat: s.etat,
//     })),
//     pieces: intervention.pieces,
//   };
//
//   if (includeCreatedAt) {
//     baseData.createdAt = intervention.createdAt;
//   }
//
//   return baseData;
// }
//
// #buildPaginationResponse(data, total, page, limit) {
//   const totalPages = Math.ceil(total / limit);
//   const hasNext = page < totalPages;
//   const hasPrev = page > 1;
//
//   return {
//     data,
//     pagination: {
//       total,
//       totalPages,
//       currentPage: page,
//       hasNext,
//       hasPrev,
//       limit,
//     },
//   };
// }
//
// // Méthodes publiques
// async getAllByMechanic(mechanicId, { page = 1, limit = 10 }) {
//   try {
//     const rendezVousIds = await this.#getRendezVousIds({ userMecanicientId: mechanicId });
//     const { interventions, total } = await this.#getInterventionsWithPagination(
//         rendezVousIds,
//         { page, limit }
//     );
//
//     const formattedData = interventions.map(intervention =>
//         this.#formatInterventionData(intervention)
//     );
//
//     return this.#buildPaginationResponse(formattedData, total, page, limit);
//   } catch (error) {
//     console.error("Error in getAllByMechanic:", error);
//     throw new Error(`Erreur lors de la récupération des interventions: ${error.message}`);
//   }
// }
//
// async getHistoriesByClient(clientId, { page = 1, limit = 10 }) {
//   try {
//     const rendezVousIds = await this.#getRendezVousIds({ userClientId: clientId });
//     const { interventions, total } = await this.#getInterventionsWithPagination(
//         rendezVousIds,
//         { page, limit },
//         { createdAt: -1 }
//     );
//
//     const formattedData = interventions.map(intervention =>
//         this.#formatInterventionData(intervention, true)
//     );
//
//     return this.#buildPaginationResponse(formattedData, total, page, limit);
//   } catch (error) {
//     console.error("Error in getHistoriesByClient:", error);
//     throw new Error(`Erreur lors de la récupération des historiques: ${error.message}`);
//   }
// }
//
// async getAll({ page = 1, limit = 10, filters = {} }) {
//   try {
//     const skip = (page - 1) * limit;
//
//     // On peut passer des filtres supplémentaires si besoin
//     const query = filters.rendezVousId
//         ? { rendezVousId: filters.rendezVousId }
//         : {};
//
//     const [interventions, total] = await Promise.all([
//       Intervention.find(query)
//           .populate(this.#getPopulateOptions())
//           .populate("services.serviceId")
//           .skip(skip)
//           .limit(limit)
//           .lean()
//           .exec(),
//
//       Intervention.countDocuments(query)
//     ]);
//
//     const formattedData = interventions.map(intervention =>
//         this.#formatInterventionData(intervention, true)
//     );
//
//     return this.#buildPaginationResponse(formattedData, total, page, limit);
//   } catch (error) {
//     console.error("Error in getAll:", error);
//     throw new Error(`Erreur lors de la récupération de toutes les interventions: ${error.message}`);
//   }
// }
//
// async getLatestFive() {
//   try {
//     // 1. Trouver les rendez-vous associés au mécanicien
//     const rendezVousIds = await RendezVous.find().select("_id");
//
//     // 2. Trouver les interventions correspondantes
//     const [interventions, total] = await Promise.all([
//       Intervention.find({
//         status: "en cours",
//         rendezVousId: { $in: rendezVousIds.map((r) => r._id) },
//       })
//           .sort({ createdAt: -1 })
//           .populate({
//             path: "rendezVousId",
//             populate: [
//               {
//                 path: "userClientId",
//                 model: "User",
//                 select: "name firstName email",
//               },
//               {
//                 path: "userMecanicientId",
//                 model: "User",
//                 select: "name firstName email",
//               },
//               { path: "vehiculeId", model: "Vehicle" },
//             ],
//           })
//           .populate("services.serviceId") // Populate les services directement
//           .skip(0)
//           .limit(5)
//           .lean()
//           .exec(),
//
//       Intervention.countDocuments({
//         rendezVousId: { $in: rendezVousIds.map((r) => r._id) },
//       }),
//     ]);
//
//     // 3. Transformer les données avec le calcul de estimateTime
//     const formattedData = interventions.map((intervention) => {
//       // Calculer la somme des durées des services
//       const estimateTime = intervention.services.reduce(
//           (total, serviceItem) => {
//             if (
//                 serviceItem.etat === "en cours" &&
//                 serviceItem.serviceId?.duree
//             ) {
//               return total + serviceItem.serviceId.duree;
//             }
//             return total;
//           },
//           0
//       );
//
//       return {
//         _id: intervention._id,
//         client: intervention.rendezVousId?.userClientId,
//         mecanicien: intervention.rendezVousId?.userMecanicientId,
//         vehicle: intervention.rendezVousId?.vehiculeId,
//         status: intervention.status,
//         estimateTime, // La somme des durées des services
//         avancement: intervention.avancement,
//         services: intervention.services.map((s) => ({
//           serviceId: s.serviceId,
//           etat: s.etat,
//         })),
//         pieces: intervention.pieces,
//       };
//     });
//
//     return {
//       data: formattedData,
//     };
//   } catch (error) {
//     console.error("Error in getAllByMechanic:", error);
//     throw new Error(
//         `Erreur lors de la récupération des interventions: ${error.message}`
//     );
//   }
// }
//
// async findInterventionByClientId(ClientId) {
//   try {
//     const interventions = await Intervention.find()
//         .populate({
//           path: "rendezVousId",
//           match: { userClientId: ClientId },
//           select:
//               "userClientId date description vehiculeId services pieces statut",
//         })
//         .populate("services.serviceId", "nom prix")
//         .populate("pieces.pieceId", "nom reference");
//
//     const filteredInterventions = interventions.filter(
//         (intervention) => intervention.rendezVousId
//     );
//
//     return filteredInterventions;
//   } catch (error) {
//     logger.error(
//         "Erreur lors de la récupération des interventions du client:",
//         error
//     );
//     throw new Error("Impossible de récupérer les interventions.");
//   }
// }
//
// async getNumberOfIntervention() {
//   logger.info("Recherche des interventions en cours...");
//   const liste = await Intervention.find({ status: "en cours" });
//   return {
//     nombre: liste.length,
//   };
// }
//
// async findNombreInterventionParEtat() {
//   const listeEnCours = await Intervention.find({
//     status: "en cours",
//   }).populate("rendezVousId services.serviceId pieces.pieceId");
//   const listeFacturee = await Intervention.find({
//     status: "facturee",
//   }).populate("rendezVousId services.serviceId pieces.pieceId");
//   const listeAttente = await Intervention.find({
//     status: "en attente",
//   }).populate("rendezVousId services.serviceId pieces.pieceId");
//   return {
//     encours: listeEnCours.length,
//     facturee: listeFacturee.length,
//     enattente: listeAttente.length,
//   };
// }
//
// async findOngoingInterventions() {
//   logger.info("Recherche des interventions en cours...");
//   const liste = await Intervention.find({ status: "en cours" }).populate(
//       "rendezVousId services.serviceId pieces.pieceId"
//   );
//   return {
//     liste: liste,
//     nombre: liste.length,
//   };
// }
//
// async updateServiceStatus(id, serviceId, etat) {
//   logger.info(
//       `Mise à jour de l'état du service ${serviceId} dans l'intervention ${id} en ${etat}`
//   );
//   return Intervention.findOneAndUpdate(
//       { _id: id, "services.serviceId": serviceId },
//       { $set: { "services.$.etat": etat } },
//       { new: true }
//   ).populate("rendezVousId services.serviceId pieces.pieceId");
// }
//
// async updatePieceQuantity(id, pieceId, quantite) {
//   logger.info(
//       `Mise à jour de la quantité de la pièce ${pieceId} dans l'intervention ${id} à ${quantite}`
//   );
//   return Intervention.findOneAndUpdate(
//       { _id: id, "pieces.pieceId": pieceId },
//       { $set: { "pieces.$.quantite": quantite } },
//       { new: true }
//   ).populate("rendezVousId services.serviceId pieces.pieceId");
// }
//
// async finalizeIntervention(id) {
//   logger.info(`Finalisation de l'intervention avec ID: ${id}`);
//   const facture = await factureService.genererFacture(id);
//   let intervention = await Intervention.findById(id);
//   const result = await Intervention.updateOne(
//       { _id: id },
//       { $set: { status: "facturee" } }
//   );
//   intervention = result;
//   return { intervention, facture };
// }
//
// async getBlocAllIntervention(status) {
//   const interventions = await Intervention.find({ status: status })
//       .populate({
//         path: "rendezVousId",
//         populate: [
//           { path: "vehiculeId", model: "Vehicle" }, // Récupère tous les champs du véhicule
//           { path: "userClientId", model: "User" }, // Récupère tous les champs du client
//           { path: "userMecanicientId", model: "User" }, // Récupère tous les champs du mécano
//         ],
//       })
//       .populate({
//         path: "services.serviceId",
//         model: "Service",
//       })
//       .populate({
//         path: "pieces.pieceId",
//         model: "Piece",
//       })
//       .exec();
//   return interventions;
// }
//
// async getBlocAllFacture() {
//   const factures = await Facture.find({ statut: "payee" })
//       .populate({
//         path: "services.serviceId",
//         model: "Service",
//       })
//       .populate({
//         path: "pieces.pieceId",
//         model: "Piece",
//       })
//       .exec();
//   return factures;
// }
//
// async getBlocTodayFacture() {
//   const startOfDay = new Date();
//   startOfDay.setHours(0, 0, 0, 0);
//
//   const endOfDay = new Date();
//   endOfDay.setHours(23, 59, 59, 999);
//
//   const factures = await Facture.find({
//     date: { $gte: startOfDay, $lt: endOfDay },
//     statut: "payee",
//   })
//       .populate({
//         path: "services.serviceId",
//         model: "Service",
//       })
//       .populate({
//         path: "pieces.pieceId",
//         model: "Piece",
//       })
//       .exec();
//
//   return factures;
// }
//
// async getOngoingInterventionForDashboard() {
//   try {
//     const interventions = await this.getBlocAllIntervention("en cours");
//
//     const interventionsWithDetails = interventions.map((intervention) => {
//       const rendezVous = intervention.rendezVousId;
//       const vehicle = rendezVous?.vehiculeId || {};
//       const client = rendezVous?.userClientId || {};
//       const mecanicien = rendezVous?.userMecanicientId || {};
//
//       let duration = intervention.services.reduce(
//           (acc, service) => acc + (service.serviceId?.duree || 0),
//           0
//       );
//
//       return {
//         _id: intervention._id,
//         status: intervention.status,
//         vehicle, // Contient tous les attributs du véhicule
//         client, // Contient tous les attributs du client
//         mecanicien, // Contient tous les attributs du mécano
//         remainingTime:
//             duration > 0 ? `${Math.floor(duration)} min` : "Terminé",
//         services: intervention.services.map((service) => ({
//           ...service.serviceId._doc, // Tous les attributs du service
//           etat: service.etat,
//         })),
//         pieces: intervention.pieces.map((piece) => ({
//           ...piece.pieceId._doc, // Tous les attributs de la pièce
//           quantite: piece.quantite,
//         })),
//       };
//     });
//
//     return interventionsWithDetails;
//   } catch (error) {
//     console.error(
//         "Erreur lors de la récupération des interventions :",
//         error
//     );
//     throw new Error(
//         "Erreur serveur lors de la récupération des interventions."
//     );
//   }
// }
//
// async getDetails(id) {
//   try {
//     const intervention = await Intervention.findById(id)
//         .populate({
//           path: "rendezVousId",
//           populate: [
//             { path: "vehiculeId", model: "Vehicle" },
//             { path: "userClientId", model: "User" },
//             { path: "userMecanicientId", model: "User" },
//           ],
//         })
//         .populate({
//           path: "services.serviceId",
//           model: "Service",
//         })
//         .populate({
//           path: "pieces.pieceId",
//           model: "Piece",
//         })
//         .exec();
//
//     return this.formatInterventionDetails(intervention);
//   } catch (error) {
//     console.error(
//         `Erreur lors de la récupération de l'intervention ${id}:`,
//         error
//     );
//     throw new Error(
//         `Erreur serveur lors de la récupération de l'intervention ${id}.`
//     );
//   }
// }
//
// formatInterventionDetails(intervention) {
//   if (!intervention) return null;
//
//   const rendezVous = intervention.rendezVousId || {};
//   const vehicle = rendezVous.vehiculeId || {};
//   const client = rendezVous.userClientId || {};
//   const mechanical = rendezVous.userMecanicientId || {};
//
//   const duration = intervention.services.reduce((total, serviceItem) => {
//     if (serviceItem.etat === "en cours" && serviceItem.serviceId?.duree) {
//       return total + serviceItem.serviceId.duree;
//     }
//     return total;
//   }, 0);
//
//   // const duration = intervention.services.reduce(
//   //   (acc, service) => acc + (service.serviceId?.duree || 0),
//   //   0
//   // );
//
//   return {
//     _id: intervention._id,
//     status: intervention.status,
//     vehicle,
//     client,
//     mechanical,
//     estimateTime: Math.floor(duration),
//     services: intervention.services.map((service) => ({
//       ...service.serviceId?._doc,
//       etat: service.etat,
//     })),
//     pieces: intervention.pieces.map((piece) => ({
//       ...piece.pieceId?._doc,
//       quantite: piece.quantite,
//       etat: piece.etat
//     })),
//   };
// }
//
// async getLatestInterventionByVehicleId(vehicleId) {
//   try {
//     const intervention = await Intervention.findOne()
//         .sort({ createdAt: -1 }) // Tri par date de création décroissante
//         .populate({
//           path: "rendezVousId",
//           match: { vehiculeId: vehicleId },
//           populate: [
//             { path: "vehiculeId", model: "Vehicle" },
//             { path: "userClientId", model: "User" },
//             { path: "userMecanicientId", model: "User" },
//           ],
//         })
//         .populate({
//           path: "services.serviceId",
//           model: "Service",
//         })
//         .populate({
//           path: "pieces.pieceId",
//           model: "Piece",
//         })
//         .exec();
//
//     console.log("last interventions === ", intervention)
//
//     // Vérifier si l'intervention existe et a un rendezVousId valide
//     if (!intervention || !intervention.rendezVousId) {
//       return null;
//     }
//
//     return this.formatInterventionDetails(intervention);
//   } catch (error) {
//     console.error(
//         `Erreur lors de la récupération de l'intervention pour le véhicule ${vehicleId}:`,
//         error
//     );
//     throw new Error(
//         `Erreur serveur lors de la récupération de l'intervention du véhicule ${vehicleId}.`
//     );
//   }
// }
//
// async getByVehicleId(vehicleId, status = "en cours") {
//   try {
//     const interventions = await Intervention.find({ status })
//         .populate({
//           path: "rendezVousId",
//           match: { vehiculeId: vehicleId },
//           populate: [
//             { path: "vehiculeId", model: "Vehicle" },
//             { path: "userClientId", model: "User" },
//             { path: "userMecanicientId", model: "User" },
//           ],
//         })
//         .populate({
//           path: "services.serviceId",
//           model: "Service",
//         })
//         .populate({
//           path: "pieces.pieceId",
//           model: "Piece",
//         })
//         .exec();
//
//     // Filtrer les interventions où rendezVousId n'est pas null
//     const filteredInterventions = interventions.filter(
//         (i) => i.rendezVousId !== null
//     );
//
//     return filteredInterventions.map(this.formatInterventionDetails);
//   } catch (error) {
//     console.error(
//         `Erreur lors de la récupération des interventions pour le véhicule ${vehicleId}:`,
//         error
//     );
//     throw new Error(
//         `Erreur serveur lors de la récupération des interventions du véhicule ${vehicleId}.`
//     );
//   }
// }
//
// async statChiffreAffaireByService(demande) {
//   const interventions = await this.getBlocAllFacture();
//
//   let chiffreaffaire = 0;
//
//   const pourcentage = new Map();
//
//   for (let i = 0; i < interventions.length; i++) {
//     for (let z = 0; z < interventions[i].services.length; z++) {
//       const service = interventions[i].services[z].serviceId;
//       const serviceId = service.nom.toString();
//       const prixActuel = parseFloat(service.prix) || 0;
//
//       if (pourcentage.has(serviceId)) {
//         pourcentage.set(
//             serviceId,
//             (parseFloat(pourcentage.get(serviceId)) + prixActuel).toFixed(2)
//         );
//       } else {
//         pourcentage.set(serviceId, prixActuel.toFixed(2));
//       }
//       chiffreaffaire += parseFloat(service.prix) || 0;
//     }
//   }
//
//   chiffreaffaire = chiffreaffaire.toFixed(2);
//
//   if (demande == "pourcentage") {
//     pourcentage.forEach((value, key) => {
//       let newValue = (value * 100) / chiffreaffaire;
//       pourcentage.set(key, newValue);
//     });
//   }
//
//   const pourcentageObj = Object.fromEntries(pourcentage);
//   return pourcentageObj;
// }
//
// // async totalRevenuParService() {
// //   const interventions = await this.getBlocAllIntervention();
// //   let chiffreaffaire = 0;
//
// //   for (let i = 0; i < interventions.length; i++) {
// //     for (let z = 0; z < interventions[i].services.length; z++) {
// //       const service = interventions[i].services[z].serviceId;
// //       chiffreaffaire += parseFloat(service.prix) || 0;
// //     }
// //   }
//
// //   chiffreaffaire = chiffreaffaire.toFixed(2);
//
// //   console.log("chiffre affaire = ", chiffreaffaire);
//
// //   return { chiffreAffaire: chiffreaffaire };
// // }
//
// async totalRevenuToday() {
//   const facture = await this.getBlocTodayFacture();
//   let total = 0;
//
//   for (let i = 0; i < facture.length; i++) {
//     total += Number(facture[i].total);
//   }
//
//   return { chiffreAffaire: Number(total.toFixed(2)) };
// }
//
// async totalRevenuParService() {
//   const facture = await this.getBlocAllFacture();
//   let total = 0;
//
//   for (let i = 0; i < facture.length; i++) {
//     for (let z = 0; z < facture[i].services.length; z++) {
//       total += parseFloat(facture[i].services[z].prix);
//     }
//   }
//
//   return { chiffreAffaire: total.toFixed(2) };
// }
//
// async FinirService(serviceId, interventionId) {
//   let intervention = await this.getById(interventionId);
//   if (!intervention) throw new Error("Intervention non trouvée");
//
//   let nombreServiceFinis = 0;
//
//   intervention.services = intervention.services.map((service) => {
//     if (service.serviceId.toString() === serviceId.toString()) {
//       service.etat = "fini";
//     }
//     if (service.etat === "fini") {
//       nombreServiceFinis++;
//     }
//     return service;
//   });
//
//   if (nombreServiceFinis === intervention.services.length) {
//     intervention.status = "terminee";
//   }
//
//   intervention.avancement =
//       (nombreServiceFinis * 100) / intervention.services.length;
//
//   await this.update(interventionId, intervention);
//
//   if (intervention.avancement >= 100) {
//     const facture = await this.finalizeIntervention(interventionId);
//   }
//
//   return await this.getDetails(interventionId);
// }
//
// async AjouterPiece(interventionId, pieceId, quantite) {
//   let intervention = await this.getById(interventionId.toString());
//   if (!intervention) throw new Error("Intervention non trouvée");
//
//   if (!Array.isArray(intervention.pieces)) {
//     intervention.pieces = [];
//   }
//
//   intervention.pieces.push({
//     pieceId,
//     quantite,
//     etat: false,
//   });
//
//   await intervention.save();
//
//   return await this.getDetails(interventionId);
// }
//
//
// async ApprouverPiece(interventionId, pieceId) {
//   try {
//     let intervention = await Intervention.findById(interventionId);
//     if (!intervention) {
//       throw new Error("Intervention non trouvée");
//     }
//
//     let piece = intervention.pieces.find(
//         (p) => p.pieceId.toString() === pieceId
//     );
//     if (!piece) {
//       throw new Error("Pièce non trouvée dans l'intervention");
//     }
//
//     piece.etat = true;
//
//     await intervention.save();
//
//     return await this.getDetails(interventionId);
//   } catch (error) {
//     return {
//       success: false,
//       message: error.message,
//     };
//   }
// }
