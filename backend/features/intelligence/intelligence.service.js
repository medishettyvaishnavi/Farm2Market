const { findNearbyMarkets } = require("../../../p3-intelligence/marketDiscovery");
const { findNearbyBuyers } = require("../../../p3-intelligence/buyerDiscovery");
const { analyzePrice } = require("../../../p3-intelligence/priceAnalysis");
const { analyzeDemand } = require("../../../p3-intelligence/demandAnalysis");
const { calculateTransportCost } = require("../../../p3-intelligence/transportCalculator");
const { calculateNetEarning } = require("../../../p3-intelligence/netEarning");

function convertToKg(quantity, unit) {
    if (unit && unit.toLowerCase() === "quintals") {
        return quantity * 100;
    }

    if (unit && unit.toLowerCase() === "tonnes") {
        return quantity * 1000;
    }

    return quantity;
}

function getRecommendation(farmer) {

    const quantityKg = convertToKg(
        farmer.quantity,
        farmer.unit
    );

    /*
     * Demo market data.
     * This is kept inside the intelligence layer for now.
     */
    const markets = [
        {
            name: "Market A",
            latitude: 18.80,
            longitude: 78.95
        },
        {
            name: "Market B",
            latitude: 18.70,
            longitude: 78.80
        },
        {
            name: "Market C",
            latitude: 19.10,
            longitude: 79.20
        }
    ];

    const buyers = [
        {
            name: "Fresh Foods",
            crop: farmer.cropName,
            requiredQuantity: 2000,
            maxPrice: farmer.expectedPrice || 24,
            verified: true,
            latitude: 18.82,
            longitude: 78.96
        },
        {
            name: "City Wholesale",
            crop: farmer.cropName,
            requiredQuantity: 5000,
            maxPrice: farmer.expectedPrice || 26,
            verified: true,
            latitude: 19.00,
            longitude: 79.10
        }
    ];

    /*
     * Person 1's request does not currently contain coordinates.
     * Therefore market/buyer distance discovery is only performed
     * when latitude and longitude are available.
     */
    let nearbyMarkets = [];
    let nearbyBuyers = [];

    if (
        farmer.latitude !== undefined &&
        farmer.longitude !== undefined
    ) {
        const farmerLocation = {
            latitude: farmer.latitude,
            longitude: farmer.longitude
        };

        nearbyMarkets = findNearbyMarkets(
            farmerLocation,
            markets,
            100
        );

        nearbyBuyers = findNearbyBuyers(
            {
                crop: farmer.cropName,
                latitude: farmer.latitude,
                longitude: farmer.longitude
            },
            buyers,
            100
        );
    }

    /*
     * Use expected price as the current price when
     * no live market price has been supplied.
     */
    const currentPrice = farmer.expectedPrice || 0;

    const historicalPrices =
        farmer.historicalPrices || [currentPrice];

    const priceAnalysis = analyzePrice(
        currentPrice,
        historicalPrices
    );

    /*
     * If demand/supply data is not available,
     * provide a neutral fallback instead of crashing.
     */
    const demandQuantity =
        farmer.demandQuantity || quantityKg;

    const availableSupply =
        farmer.availableSupply || quantityKg;

    const demandAnalysis = analyzeDemand(
        demandQuantity,
        availableSupply
    );

    const bestBuyer =
        nearbyBuyers.length > 0
            ? nearbyBuyers[0]
            : buyers[0];

    let transport = null;
    let earning = null;

    if (bestBuyer && bestBuyer.distanceKm !== undefined) {

        transport = calculateTransportCost(
            bestBuyer.distanceKm,
            quantityKg
        );

        earning = calculateNetEarning(
            bestBuyer.maxPrice,
            quantityKg,
            transport.totalTransportCost
        );
    }

    return {
        success: true,

        crop: farmer.cropName,

        mandi:
            nearbyMarkets.length > 0
                ? nearbyMarkets[0].name
                : farmer.location || "Market information unavailable",

        currentModalPrice: currentPrice,

        minPrice:
            priceAnalysis.historicalAverage || currentPrice,

        maxPrice:
            currentPrice > 0
                ? Math.round(currentPrice * 1.05)
                : 0,

        priceTrend:
            priceAnalysis.trend === "INCREASING"
                ? "up"
                : priceAnalysis.trend === "DECREASING"
                    ? "down"
                    : "stable",

        changePercent:
            `${priceAnalysis.changePercent >= 0 ? "+" : ""}${priceAnalysis.changePercent}%`,

        recommendation:
            demandAnalysis.demandLevel === "VERY_HIGH"
                ? `Strong demand. Consider holding briefly or accepting offers above ₹${farmer.expectedPrice || currentPrice}.`
                : `Compare buyer offers before selling.`,

        advisoryText:
            demandAnalysis.negotiationSignal === "STRONG"
                ? "Demand is strong. You may have better negotiation power with verified buyers."
                : "Compare available buyers and transport costs before accepting an offer.",

        bestTimeToSell:
            farmer.harvestDate || "Based on current market conditions",

        predictedPrices7Days: [
            { day: "Day 1", price: currentPrice },
            { day: "Day 2", price: Math.round(currentPrice * 1.01) },
            { day: "Day 3", price: Math.round(currentPrice * 1.02) },
            { day: "Day 4", price: Math.round(currentPrice * 1.02) },
            { day: "Day 5", price: Math.round(currentPrice * 1.03) },
            { day: "Day 6", price: Math.round(currentPrice * 1.04) },
            { day: "Day 7", price: Math.round(currentPrice * 1.05) }
        ],

        intelligence: {
            farmer: {
                crop: farmer.cropName,
                variety: farmer.variety,
                quantity: farmer.quantity,
                unit: farmer.unit,
                quantityKg,
                location: farmer.location,
                state: farmer.state,
                grade: farmer.grade,
                isOrganic: farmer.isOrganic
            },

            nearbyMarkets,
            nearbyBuyers,

            priceAnalysis,
            demandAnalysis,

            recommendation: {
                bestBuyer,
                transport,
                earning
            }
        }
    };
}

module.exports = {
    getRecommendation
};