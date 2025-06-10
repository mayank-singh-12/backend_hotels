const mongoose = require("mongoose");
require("dotenv").config();
const mongoUri = process.env.MONGODB;

async function initializeDatabase() {
  await mongoose
    .connect(mongoUri)
    .then(() => console.log("Connected to Database."))
    .catch((error) =>
      console.log("Error found while connecting to Database: ", error)
    );
}

module.exports = { initializeDatabase };
