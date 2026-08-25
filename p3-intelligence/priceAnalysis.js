function analyzePrice(currentPrice, historicalPrices) {
    if (!historicalPrices || historicalPrices.length === 0) {
        return {
            currentPrice,
            historicalAverage: currentPrice,
            trend: "UNKNOWN",
            changePercent: 0
        };
    }

    const total = historicalPrices.reduce(
        (sum, price) => sum + price,
        0
    );

    const historicalAverage = total / historicalPrices.length;

    const changePercent =
        ((currentPrice - historicalAverage) / historicalAverage) * 100;

    let trend;

    if (changePercent >= 5) {
        trend = "INCREASING";
    } else if (changePercent <= -5) {
        trend = "DECREASING";
    } else {
        trend = "STABLE";
    }

    return {
        currentPrice,
        historicalAverage: Number(historicalAverage.toFixed(2)),
        trend,
        changePercent: Number(changePercent.toFixed(2))
    };
}

module.exports = { analyzePrice };