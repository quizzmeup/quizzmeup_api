const User = require("../models/User");
const bcrypt = require("bcryptjs");
const uid2 = require("uid2");
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} = require("../utils/errors");

const AuthController = {
  // 🔑 Inscription
  signup: async (req, res, next) => {
    const { email, password, name } = req.body;

    // 🔍 Vérification des champs requis
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");
    if (!name) missingFields.push("name");

    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Missing required fields: ${missingFields.join(", ")}`
        )
      );
    }

    // 📌 Vérifier si l'email est déjà utilisé
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ConflictError("Email already in use"));
    }

    // 🔑 Génération du salt et hash du mot de passe
    const salt = uid2(16);
    const hash = bcrypt.hashSync(password + salt, 10);

    // 🔑 Création de l'utilisateur
    const newUser = new User({
      email,
      salt,
      hash,
      name,
    });
    await newUser.save();

    // 🎯 Réponse optimisée
    res.status(201).json({
      _id: newUser._id,
      token: newUser.generateToken(),
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  },

  // 🔐 Connexion
  login: async (req, res, next) => {
    const { email, password } = req.body;

    // 🔍 Vérification des champs requis
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");

    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Missing required fields: ${missingFields.join(", ")}`
        )
      );
    }

    // 📌 Récupération de l'utilisateur avec son salt et son hash
    const user = await User.findOne({ email }).select("+salt +hash");

    if (!user) {
      return next(new NotFoundError(null, { modelName: "User" }));
    }

    if (!bcrypt.compareSync(password + user.salt, user.hash)) {
      return next(new UnauthorizedError("Invalid credentials"));
    }

    // 🎯 Réponse optimisée
    res.status(200).json({
      _id: user._id,
      token: user.generateToken(),
      user: {
        name: user.name,
        email: user.email,
      },
    });
  },
};

module.exports = AuthController;
