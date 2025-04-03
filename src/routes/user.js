const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/user_controller");
const asyncHandler = require("../middlewares/async-handler");
const authMiddleware = require("../middlewares/auth_middleware");
const adminOnly = require("../middlewares/admin_only");

router.use(authMiddleware);

router.get("/api/users", adminOnly, asyncHandler(UsersController.getUsers));

module.exports = router;
