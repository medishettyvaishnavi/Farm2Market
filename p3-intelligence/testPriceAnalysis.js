const { analyzePrice } = require("./priceAnalysis");

const currentPrice = 23;

const historicalPrices = [
    19,
    20,
    21,
    22
];

const result = analyzePrice(
    currentPrice,
    historicalPrices
);

console.log("Price Analysis:");
console.log(result);