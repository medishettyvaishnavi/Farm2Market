const {
    getRecommendation
} = require("./intelligence.service");

function getIntelligenceRecommendation(req, res) {

    try {

        const farmer = req.body;

        const recommendation =
            getRecommendation(farmer);

        res.status(200).json({
            success: true,
            data: recommendation
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to generate recommendation"
        });
    }
}

module.exports = {
    getIntelligenceRecommendation
};