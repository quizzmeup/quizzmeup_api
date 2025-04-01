const mongoose = require("mongoose");
require("dotenv").config();

const connectToDatabase = async () => {
  try {
    //console.log("mongodb://localhost:27017/BDD");
    await mongoose.connect("mongodb://localhost:27017/BDD", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connecté !");
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB :", error);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
