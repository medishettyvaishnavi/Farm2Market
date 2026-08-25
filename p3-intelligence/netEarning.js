function calculateNetEarning(sellingPricePerKg, quantityKg, transportCost) {
    const grossEarning = sellingPricePerKg * quantityKg;

    const netEarning = grossEarning - transportCost;

    const netEarningPerKg = netEarning / quantityKg;

    return {
        sellingPricePerKg,
        quantityKg,
        grossEarning: Number(grossEarning.toFixed(2)),
        transportCost: Number(transportCost.toFixed(2)),
        netEarning: Number(netEarning.toFixed(2)),
        netEarningPerKg: Number(netEarningPerKg.toFixed(2))
    };
}

module.exports = { calculateNetEarning };