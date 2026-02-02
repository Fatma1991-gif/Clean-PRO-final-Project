const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to MongoDB without the deprecated options
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Listen for connection errors after the initial connection is established
    mongoose.connection.on('error', err => {
      console.error(`❌ MongoDB connection error after initial connection: ${err.message}`);
    });

  } catch (error) {
    // This will catch errors during the initial connection attempt
    console.error(`❌ MongoDB initial connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

