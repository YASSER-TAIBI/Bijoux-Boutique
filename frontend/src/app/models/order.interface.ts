export interface CustomerInfo {
    email: string;
    firstName: string;
    lastName: string;
    companyName: string;
    country: string;
    streetAddress: string;
    apartment: string;
    postcode: string;
    city: string;
    phone: string;
    notes: string;
    paymentMethod: 'bank-transfer' | 'cash-delivery';
}

export interface OrderDetails {
    _id?: string;              // Identifiant unique de la commande
    orderNumber: string;      // Numéro de la commande
    userId: string;           // Référence vers l'utilisateur
    items: OrderItem[];       // Liste des produits commandés
    totalPrice: number;       // Prix total de la commande
    status: string;           // Statut de la commande (en cours, expédiée, livrée)
    orderDate: Date;         // Date de la commande
    deliveryDate: Date;      // Date estimée de livraison
    paymentMethod: string;    // Méthode de paiement
    shippingAddress: {        // Adresse de livraison
        street: string;       // Rue
        city: string;        // Ville
        zip: string;         // Code postal
        country: string;     // Pays
    };
}

export interface OrderItem {
    productId: string;       // Référence vers le produit
    name: string;           // Nom du produit
    price: number;          // Prix unitaire du produit
    quantity: number;       // Quantité commandée
}
