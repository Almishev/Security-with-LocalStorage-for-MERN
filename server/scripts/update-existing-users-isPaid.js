import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../auth/userModel.js';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

async function updateExistingUsers() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    // Обновяваме всички потребители, които нямат isPaid поле ИЛИ имат undefined
    const result1 = await User.updateMany(
      { isPaid: { $exists: false } }, // Намираме всички без isPaid поле
      { $set: { isPaid: false } }     // Задаваме isPaid: false
    );

    // Също обновяваме тези, които имат null или undefined стойност
    const result2 = await User.updateMany(
      { $or: [{ isPaid: null }, { isPaid: { $exists: false } }] },
      { $set: { isPaid: false } }
    );

    console.log(`✅ Updated ${result1.modifiedCount + result2.modifiedCount} users with isPaid: false`);

    // Проверяваме всички потребители
    const allUsers = await User.find({}, 'userName email isPaid role');
    console.log('\n📋 All users:');
    allUsers.forEach(user => {
      console.log(`  - ${user.userName} (${user.email}): role=${user.role}, isPaid=${user.isPaid ?? 'undefined'}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateExistingUsers();

