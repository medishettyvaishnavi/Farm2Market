const { findNearbyMarkets } = require("./marketDiscovery");

const farmer = {
    latitude: 18.79,
    longitude: 78.91
};

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
    },
    {
        name: "Market D",
        latitude: 20.00,
        longitude: 80.00
    }
];

const nearbyMarkets = findNearbyMarkets(farmer, markets, 100);

console.log("Nearby markets:");

nearbyMarkets.forEach(market => {
    console.log(
        `${market.name}: ${market.distanceKm} km`
    );
});