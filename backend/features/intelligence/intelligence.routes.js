const express = require("express");

const {
    getIntelligenceRecommendation
} = require("./intelligence.controller");

const router = express.Router();

router.post(
    "/recommend",
    getIntelligenceRecommendation
);

module.exports = router;