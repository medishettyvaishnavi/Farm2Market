const { calculateDistance } = require("../../../p3-intelligence/distance");
const { findNearbyMarkets } = require("../../../p3-intelligence/marketDiscovery");
const { findNearbyBuyers } = require("../../../p3-intelligence/buyerDiscovery");
const { analyzePrice } = require("../../../p3-intelligence/priceAnalysis");
const { analyzeDemand } = require("../../../p3-intelligence/demandAnalysis");
const { calculateTransportCost } = require("../../../p3-intelligence/transportCalculator");
const { calculateNetEarning } = require("../../../p3-intelligence/netEarning");

function getRecommendation(farmer) {

    // Temporary sample data.
    // Later this will come from MongoDB.

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
            crop: farmer.crop,
            requiredQuantity: 2000,
            maxPrice: 24,
            verified: true,
            latitude: 18.82,
            longitude: 78.96
        },
        {
            name: "City Wholesale",
            crop: farmer.crop,
            requiredQuantity: 5000,
            maxPrice: 26,
            verified: true,
            latitude: 19.00,
            longitude: 79.10
        }
    ];

    const nearbyMarkets = findNearbyMarkets(
        farmer,
        markets,
        100
    );

    const nearbyBuyers = findNearbyBuyers(
        farmer,
        buyers,
        100
    );

    const priceAnalysis = analyzePrice(
        farmer.currentPrice,
        farmer.historicalPrices
    );

    const demandAnalysis = analyzeDemand(
        farmer.demandQuantity,
        farmer.availableSupply
    );

    const bestBuyer = nearbyBuyers[0] || null;

    let earning = null;
    let transport = null;

    if (bestBuyer) {

        transport = calculateTransportCost(
            bestBuyer.distanceKm,
            farmer.quantity
        );

        earning = calculateNetEarning(
            bestBuyer.maxPrice,
            farmer.quantity,
            transport.totalTransportCost
        );
    }

    return {
        farmer: {
            crop: farmer.crop,
            quantity: farmer.quantity
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
    };
}

module.exports = {
    getRecommendation
};