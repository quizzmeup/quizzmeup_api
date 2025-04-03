const express = require("express");
const router = express.Router();
const cohorts_controller = require("../controllers/cohorts_controller");
const asyncHandler = require("../middlewares/async-handler");
const authMiddleware = require("../middlewares/auth_middleware");
const adminOnly = require("../middlewares/admin_only");

router.use(authMiddleware);

router.get("/", asyncHandler(cohorts_controller.getAllCohorts));
router.post("/", adminOnly, asyncHandler(cohorts_controller.createCohort));

module.exports = router;
