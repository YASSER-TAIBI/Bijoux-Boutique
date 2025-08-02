const mongoose = require('mongoose');
const Product = require('../models/Product');

// Configuration de la base de données
const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jalorine_database';

// Données de produits de démonstration
const sampleProducts = [
  {
    name: "Bague Solitaire Diamant",
    description: "Magnifique bague solitaire avec diamant de 1 carat, monture en or blanc 18k. Un classique intemporel pour les grandes occasions.",
    price: 2500.00,
    category: "Bagues",
    images: ["bague-solitaire-diamant.jpg"],
    material: "Or blanc 18k, Diamant",
    stock: 5,
    isAvailable: true
  },
  {
    name: "Collier Perles de Culture",
    description: "Élégant collier composé de perles de culture d'eau douce, fermoir en argent sterling. Longueur 45cm.",
    price: 350.00,
    category: "Colliers",
    images: ["collier-perles-culture.jpg"],
    material: "Perles de culture, Argent sterling",
    stock: 12,
    isAvailable: true
  },
  {
    name: "Bracelet Tennis Diamants",
    description: "Bracelet tennis serti de diamants brillants, monture en or jaune 14k. Éclat et sophistication garantis.",
    price: 1800.00,
    category: "Bracelets",
    images: ["bracelet-tennis-diamants.jpg"],
    material: "Or jaune 14k, Diamants",
    stock: 3,
    isAvailable: true
  },
  {
    name: "Boucles d'oreilles Émeraude",
    description: "Superbes boucles d'oreilles pendantes avec émeraudes naturelles et diamants, monture en platine.",
    price: 3200.00,
    category: "Boucles d'oreilles",
    images: ["boucles-oreilles-emeraude.jpg"],
    material: "Platine, Émeraudes, Diamants",
    stock: 2,
    isAvailable: true
  },
  {
    name: "Bague Alliance Classique",
    description: "Alliance classique en or rose 18k, finition polie. Symbole d'amour éternel.",
    price: 450.00,
    category: "Bagues",
    images: ["alliance-classique-or-rose.jpg"],
    material: "Or rose 18k",
    stock: 15,
    isAvailable: true
  },
  {
    name: "Collier Chaîne Serpentine",
    description: "Collier chaîne serpentine en argent sterling, design moderne et élégant. Longueur 50cm.",
    price: 120.00,
    category: "Colliers",
    images: ["collier-chaine-serpentine.jpg"],
    material: "Argent sterling 925",
    stock: 20,
    isAvailable: true
  },
  {
    name: "Bracelet Jonc Gravé",
    description: "Bracelet jonc en or jaune avec gravures artisanales, pièce unique réalisée à la main.",
    price: 680.00,
    category: "Bracelets",
    images: ["bracelet-jonc-grave.jpg"],
    material: "Or jaune 18k",
    stock: 1,
    isAvailable: true
  },
  {
    name: "Boucles d'oreilles Créoles",
    description: "Boucles d'oreilles créoles en or blanc serties de petits diamants, parfaites pour le quotidien.",
    price: 890.00,
    category: "Boucles d'oreilles",
    images: ["creoles-diamants-or-blanc.jpg"],
    material: "Or blanc 18k, Diamants",
    stock: 8,
    isAvailable: true
  },
  {
    name: "Bague Vintage Saphir",
    description: "Bague vintage avec saphir bleu central entouré de diamants, style Art Déco authentique.",
    price: 2100.00,
    category: "Bagues",
    images: ["bague-vintage-saphir.jpg"],
    material: "Or blanc 18k, Saphir, Diamants",
    stock: 1,
    isAvailable: true
  },
  {
    name: "Parure Complète Rubis",
    description: "Parure complète comprenant collier, boucles d'oreilles et bracelet assortis, sertis de rubis.",
    price: 4500.00,
    category: "Autres",
    images: ["parure-complete-rubis.jpg"],
    material: "Or jaune 18k, Rubis, Diamants",
    stock: 1,
    isAvailable: true
  },
  {
    name: "Bracelet Cuir et Argent",
    description: "Bracelet moderne en cuir noir tressé avec éléments en argent sterling, style contemporain.",
    price: 85.00,
    category: "Bracelets",
    images: ["bracelet-cuir-argent.jpg"],
    material: "Cuir, Argent sterling",
    stock: 25,
    isAvailable: true
  },
  {
    name: "Boucles d'oreilles Perles",
    description: "Délicates boucles d'oreilles avec perles d'eau douce et crochets en or rose.",
    price: 165.00,
    category: "Boucles d'oreilles",
    images: ["boucles-oreilles-perles.jpg"],
    material: "Or rose 14k, Perles d'eau douce",
    stock: 18,
    isAvailable: true
  }
];

async function seedProducts() {
  try {
    // Connexion à la base de données
    console.log('Connexion à la base de données...');
    await mongoose.connect(DB_URI);
    console.log('Connecté à MongoDB');

    // Vérifier si des produits existent déjà
    const existingProducts = await Product.countDocuments();
    console.log(`Nombre de produits existants: ${existingProducts}`);

    if (existingProducts > 0) {
      console.log('Des produits existent déjà. Souhaitez-vous les remplacer ?');
      console.log('Pour forcer la réinitialisation, utilisez: node seed-products.js --force');
      
      if (!process.argv.includes('--force')) {
        console.log('Ajout des nouveaux produits sans supprimer les existants...');
      } else {
        console.log('Suppression des produits existants...');
        await Product.deleteMany({});
        console.log('Produits existants supprimés.');
      }
    }

    // Insérer les nouveaux produits
    console.log('Insertion des produits de démonstration...');
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`${insertedProducts.length} produits ajoutés avec succès !`);

    // Afficher un résumé
    const totalProducts = await Product.countDocuments();
    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: '$price' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    console.log('\n=== RÉSUMÉ ===');
    console.log(`Total des produits: ${totalProducts}`);
    console.log('\nPar catégorie:');
    productsByCategory.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} produits (valeur totale: ${cat.totalValue.toFixed(2)}€)`);
    });

    console.log('\n✅ Base de données initialisée avec succès !');
    console.log('Vous pouvez maintenant tester l\'interface d\'administration des produits.');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('Connexion fermée.');
    process.exit(0);
  }
}

// Exécuter le script
if (require.main === module) {
  console.log('🚀 Initialisation des produits de démonstration...\n');
  seedProducts();
}

module.exports = { seedProducts, sampleProducts };
