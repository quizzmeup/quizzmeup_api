const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth_controller");
const asyncHandler = require("../middlewares/async-handler");

// 🔑 Signup - POST /auth/signup
router.post("/signup", asyncHandler(AuthController.signup));

// 🔐 Login - POST /auth/login
router.post("/login", asyncHandler(AuthController.login));

module.exports = router;
