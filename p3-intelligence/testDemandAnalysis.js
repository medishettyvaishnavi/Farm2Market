const { analyzeDemand } = require("./demandAnalysis");

const demandQuantity = 5000;
const availableSupply = 2000;

const result = analyzeDemand(
    demandQuantity,
    availableSupply
);

console.log("Demand Analysis:");
console.log(result);