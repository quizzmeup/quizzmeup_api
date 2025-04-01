const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const TOKEN_EXPIRATION = "7d";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    salt: { type: String, required: true },
    hash: { type: String, required: true },

    name: { type: String, required: true },

    isAdmin: { type: Boolean, default: false },

    cohorts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cohort",
      },
    ],
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password + this.salt, this.hash);
};

UserSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION,
  });
};

module.exports = mongoose.model("User", UserSchema);
