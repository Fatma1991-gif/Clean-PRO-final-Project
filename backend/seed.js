const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Service = require('./models/Service');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

const services = [
  {
    name: 'Nettoyage Maison Standard',
    description: 'Nettoyage complet de votre maison incluant dépoussiérage, aspiration, nettoyage des sols et des surfaces.',
    category: 'maison',
    price: 80,
    duration: 3,
    image: '/images/services/house-cleaning.jpg',
    isActive: true
  },
  {
    name: 'Nettoyage Maison Premium',
    description: 'Nettoyage approfondi avec lavage des vitres, nettoyage des appareils électroménagers et désinfection complète.',
    category: 'maison',
    price: 150,
    duration: 5,
    image: '/images/services/house-premium.jpg',
    isActive: true
  },
  {
    name: 'Nettoyage Bureau Standard',
    description: 'Nettoyage quotidien des espaces de travail, vidage des poubelles, nettoyage des surfaces.',
    category: 'bureau',
    price: 100,
    duration: 2,
    image: '/images/services/office-cleaning.jpg',
    isActive: true
  },
  {
    name: 'Nettoyage Bureau Complet',
    description: 'Nettoyage complet incluant moquettes, vitres, sanitaires et espaces communs.',
    category: 'bureau',
    price: 250,
    duration: 6,
    image: '/images/services/office-complete.jpg',
    isActive: true
  },
  {
    name: 'Nettoyage Bâtiment',
    description: 'Service de nettoyage pour immeubles et copropriétés, parties communes et escaliers.',
    category: 'batiment',
    price: 200,
    duration: 4,
    image: '/images/services/building-cleaning.jpg',
    isActive: true
  },
  {
    name: 'Nettoyage Bâtiment Industriel',
    description: 'Nettoyage spécialisé pour entrepôts et bâtiments industriels.',
    category: 'batiment',
    price: 400,
    duration: 8,
    image: '/images/services/industrial-cleaning.jpg',
    isActive: true
  },
  {
    name: 'Lavage Véhicule Intérieur',
    description: 'Nettoyage complet de l\'intérieur de votre véhicule: sièges, tapis, tableau de bord.',
    category: 'vehicule',
    price: 50,
    duration: 1.5,
    image: '/images/services/car-interior.jpg',
    isActive: true
  },
  {
    name: 'Lavage Véhicule Complet',
    description: 'Lavage intérieur et extérieur avec cire de protection et nettoyage des jantes.',
    category: 'vehicule',
    price: 100,
    duration: 3,
    image: '/images/services/car-complete.jpg',
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🔄 Nettoyage de la base de données...');

    // Delete existing data
    await User.deleteMany({});
    console.log('✓ Utilisateurs supprimés');
    
    await Service.deleteMany({});
    console.log('✓ Services supprimés');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = await User.create({
      name: 'Admin Clean PRO',
      email: 'admin@cleanpro.com',
      phone: '0600000000',
      password: hashedPassword,
      role: 'admin',
      address: '123 Rue de l\'Administration, Paris'
    });
    console.log('✓ Admin créé:', adminUser.email);

    // Create agents (personnel)
    const agentPassword = await bcrypt.hash('agent123', salt);
    
    const agents = await User.insertMany([
      {
        name: 'Chenkaaoui Ahmed',
        email: 'chenkaouiahmed@gmail.com',
        phone: '94949494',
        password: agentPassword,
        role: 'personnel',
        address: '1True habib cite nocha tatouine',
        skills: [
          { category: 'maison', proficiency: 'expert' },
          { category: 'bureau', proficiency: 'intermédiaire' }
        ],
        availability: {
          isAvailable: true,
          availableDays: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'],
          startTime: '08:00',
          endTime: '18:00'
        }
      },
      {
        name: 'rim chenkaaoui',
        email: 'chenkaaouirim@gmail.com',
        phone: '51229229',
        password: agentPassword,
        role: 'personnel',
        address: '1True habib cite nocha tatouine',
        skills: [
          { category: 'maison', proficiency: 'intermédiaire' },
          { category: 'vehicule', proficiency: 'expert' }
        ],
        availability: {
          isAvailable: true,
          availableDays: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
          startTime: '07:00',
          endTime: '19:00'
        }
      },
      {
        name: 'chenkaaoui fatma',
        email: 'fatmachenkaaoui15@gmail.com',
        phone: '24452793',
        password: agentPassword,
        role: 'personnel',
        address: '1True habib cite nocha tatouine',
        skills: [
          { category: 'batiment', proficiency: 'expert' },
          { category: 'bureau', proficiency: 'expert' }
        ],
        availability: {
          isAvailable: true,
          availableDays: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'],
          startTime: '08:00',
          endTime: '17:00'
        }
      }
    ]);
    console.log(`✓ ${agents.length} agents créés`);

    // Insert services
    const createdServices = await Service.insertMany(services);
    console.log(`✓ ${createdServices.length} services créés`);

    // Create clients
    const clientPassword = await bcrypt.hash('client123', salt);
    
    const clients = await User.insertMany([
      {
        name: 'Med/94',
        email: 'medounissi@gmail.com',
        phone: '56510149',
        password: clientPassword,
        role: 'client',
        address: 'Cité Abbas tatouine'
      },
      {
        name: 'Amna mahdhi',
        email: 'amna30@gmail.com',
        phone: '29096451',
        password: clientPassword,
        role: 'client',
        address: 'Ghommrasen tatouine'
      }
    ]);
    console.log(`✓ ${clients.length} clients créés`);

    console.log('\n✅ Base de données initialisée avec succès!');
    console.log('\n📋 Admin:');
    console.log('   Email: admin@cleanpro.com');
    console.log('   Mot de passe: admin123');
    console.log(`\n👥 Agents: ${agents.length} agents disponibles`);
    console.log(`\n👤 Clients: ${clients.length} clients`);
    console.log(`\n📦 Services: ${createdServices.length} services disponibles`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

seedDatabase();
