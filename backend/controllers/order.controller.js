const Order = require('../models/order.model');

// Créer une nouvelle commande
exports.createOrder = async (req, res) => {
  try {
    // Vérifier que l'utilisateur crée une commande pour lui-même
    if (req.user.id !== req.body.userId) {
      return res.status(403).json({ message: 'Non autorisé à créer une commande pour un autre utilisateur' });
    }

    const order = new Order({
      ...req.body,
      userId: req.user.id // Utiliser l'ID de l'utilisateur authentifié
    });
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la commande', error: error.message });
  }
};

// Obtenir toutes les commandes d'un utilisateur
exports.getUserOrders = async (req, res) => {
  try {
    // Vérifier que l'utilisateur accède à ses propres commandes
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Non autorisé à accéder aux commandes d\'un autre utilisateur' });
    }

    const orders = await Order.find({ userId: req.params.userId })
      .sort({ orderDate: -1 }); // Trier par date décroissante
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error: error.message });
  }
};

// Obtenir une commande spécifique
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier que l'utilisateur accède à sa propre commande
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé à accéder à cette commande' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la commande', error: error.message });
  }
};

// Mettre à jour le statut d'une commande
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier que l'utilisateur met à jour sa propre commande
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé à modifier cette commande' });
    }

    // Vérifier que le nouveau statut est valide
    const validStatus = ['En cours', 'En préparation', 'Expédié', 'Livré', 'Annulé'];
    if (!validStatus.includes(req.body.status)) {
      return res.status(400).json({ message: 'Statut de commande invalide' });
    }

    order.status = req.body.status;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la commande', error: error.message });
  }
};
