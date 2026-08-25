const { findNearbyBuyers } = require("./buyerDiscovery");

const farmer = {
    crop: "tomato",
    quantity: 1000,
    latitude: 18.79,
    longitude: 78.91
};

const buyers = [
    {
        name: "Fresh Foods",
        crop: "tomato",
        requiredQuantity: 2000,
        maxPrice: 24,
        verified: true,
        latitude: 18.82,
        longitude: 78.96
    },
    {
        name: "Local Trader",
        crop: "tomato",
        requiredQuantity: 5000,
        maxPrice: 21,
        verified: false,
        latitude: 18.75,
        longitude: 78.88
    },
    {
        name: "Vegetable Hub",
        crop: "onion",
        requiredQuantity: 2000,
        maxPrice: 25,
        verified: true,
        latitude: 18.80,
        longitude: 78.90
    },
    {
        name: "City Wholesale",
        crop: "tomato",
        requiredQuantity: 5000,
        maxPrice: 26,
        verified: true,
        latitude: 19.00,
        longitude: 79.10
    }
];

const nearbyBuyers = findNearbyBuyers(farmer, buyers, 100);

console.log("Nearby verified buyers:");

nearbyBuyers.forEach(buyer => {
    console.log(
        `${buyer.name}: ${buyer.distanceKm} km | ₹${buyer.maxPrice}/kg`
    );
});