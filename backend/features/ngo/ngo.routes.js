const express = require("express");
const { authenticate, authorizeRoles } = require("../../middleware/auth");
const { getNgoDashboard } = require("./ngo.controller");

const router = express.Router();

router.get("/dashboard", authenticate, authorizeRoles("NGO"), getNgoDashboard);

module.exports = router;
