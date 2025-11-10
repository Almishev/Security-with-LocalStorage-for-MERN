import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../auth/userModel.js';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/MERN_CRUD_WITH_AUTH';

const testUsers = [
  {
    userName: 'Admin User',
    email: 't.toni@abv.bg',
    password: '123456',
    role: 'admin',
    isPaid: false // Админите не се нуждаят от плащане
  },
  {
    userName: 'Regular User',
    email: 'petq@abv.bg',
    password: '123456',
    role: 'user',
    isPaid: false // Обикновен потребител без плащане
  }
];

async function setupTestUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`User ${userData.email} already exists, updating...`);
        // Update user data if needed
        existingUser.userName = userData.userName;
        existingUser.role = userData.role;
        // Обновяваме isPaid само ако не е зададено
        if (existingUser.isPaid === undefined) {
          existingUser.isPaid = userData.isPaid;
        }
        await existingUser.save();
        console.log(`Updated user: ${userData.email} with role: ${userData.role}`);
      } else {
        // Create new user
        const user = new User(userData);
        await user.save();
        console.log(`Created user: ${userData.email} with role: ${userData.role}`);
      }
    }

    console.log('Test users setup completed!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error setting up test users:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

setupTestUsers();

