const { calculateTransportCost } = require("./transportCalculator");

const distanceKm = 40;
const quantityKg = 1000;

const result = calculateTransportCost(
    distanceKm,
    quantityKg
);

console.log("Transport Calculation:");
console.log(result);