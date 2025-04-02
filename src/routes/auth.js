const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");
const authMiddleware = require("../middlewares//auth_middleware");
const asyncHandler = require("../middlewares/async-handler");

// 🔑 Signup - POST /auth/signup
router.post("/signup", asyncHandler(authController.signup));

// 🔐 Login - POST /auth/login
router.post("/login", asyncHandler(authController.login));

// 👨‍💼 Elevate - POST /auth/elevate
router.post(
  "/elevate",
  authMiddleware,
  asyncHandler(authController.elevateToAdmin)
);

module.exports = router;
