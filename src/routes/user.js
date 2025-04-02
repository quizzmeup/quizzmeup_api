const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/user_controller");
const asyncHandler = require("../middlewares/async-handler");
const adminOnly = require("../middlewares/admin_only");

router.get("/api/users", adminOnly, asyncHandler(UsersController.getUsers));

module.exports = router;
