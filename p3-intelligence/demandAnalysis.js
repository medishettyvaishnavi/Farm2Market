function analyzeDemand(demandQuantity, availableSupply) {
    if (availableSupply <= 0) {
        return {
            demandQuantity,
            availableSupply,
            demandRatio: null,
            demandLevel: "VERY_HIGH",
            negotiationSignal: "STRONG"
        };
    }

    const demandRatio = demandQuantity / availableSupply;

    let demandLevel;
    let negotiationSignal;

    if (demandRatio >= 2) {
        demandLevel = "VERY_HIGH";
        negotiationSignal = "STRONG";
    } else if (demandRatio >= 1.5) {
        demandLevel = "HIGH";
        negotiationSignal = "GOOD";
    } else if (demandRatio >= 1) {
        demandLevel = "MEDIUM";
        negotiationSignal = "NORMAL";
    } else {
        demandLevel = "LOW";
        negotiationSignal = "WEAK";
    }

    return {
        demandQuantity,
        availableSupply,
        demandRatio: Number(demandRatio.toFixed(2)),
        demandLevel,
        negotiationSignal
    };
}

module.exports = { analyzeDemand };