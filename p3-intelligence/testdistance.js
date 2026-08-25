const { calculateDistance } = require("./distance");

const farmer = {
    latitude: 18.79,
    longitude: 78.91
};

const market = {
    name: "Market A",
    latitude: 18.80,
    longitude: 78.95
};

const distance = calculateDistance(
    farmer.latitude,
    farmer.longitude,
    market.latitude,
    market.longitude
);

console.log(`Distance to ${market.name}: ${distance.toFixed(2)} km`);