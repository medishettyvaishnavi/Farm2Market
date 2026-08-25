const { calculateNetEarning } = require("./netEarning");

const sellingPricePerKg = 24;
const quantityKg = 1000;
const transportCost = 1200;

const result = calculateNetEarning(
    sellingPricePerKg,
    quantityKg,
    transportCost
);

console.log("Net Earning Calculation:");
console.log(result);