const { calculateDistance } = require("./distance");

function findNearbyMarkets(farmer, markets, maxDistanceKm = 100) {
    return markets
        .map(market => {
            const distance = calculateDistance(
                farmer.latitude,
                farmer.longitude,
                market.latitude,
                market.longitude
            );

            return {
                ...market,
                distanceKm: Number(distance.toFixed(2))
            };
        })
        .filter(market => market.distanceKm <= maxDistanceKm)
        .sort((a, b) => a.distanceKm - b.distanceKm);
}

module.exports = { findNearbyMarkets };