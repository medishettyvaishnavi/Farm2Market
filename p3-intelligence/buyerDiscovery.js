const { calculateDistance } = require("./distance");

function findNearbyBuyers(farmer, buyers, maxDistanceKm = 100) {
    return buyers
        .filter(buyer => buyer.verified === true)
        .filter(buyer => buyer.crop.toLowerCase() === farmer.crop.toLowerCase())
        .filter(buyer => buyer.requiredQuantity >= farmer.quantity)
        .map(buyer => {
            const distance = calculateDistance(
                farmer.latitude,
                farmer.longitude,
                buyer.latitude,
                buyer.longitude
            );

            return {
                ...buyer,
                distanceKm: Number(distance.toFixed(2))
            };
        })
        .filter(buyer => buyer.distanceKm <= maxDistanceKm)
        .sort((a, b) => a.distanceKm - b.distanceKm);
}

module.exports = { findNearbyBuyers };