const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/user_controller");
const asyncHandler = require("../middlewares/async-handler");

router.get("/users", asyncHandler(UsersController.getUsers));

module.exports = router;
