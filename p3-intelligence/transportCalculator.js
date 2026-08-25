function calculateTransportCost(distanceKm, quantityKg, ratePerKm = 30) {
    const totalTransportCost = distanceKm * ratePerKm;

    const transportCostPerKg =
        totalTransportCost / quantityKg;

    return {
        distanceKm,
        quantityKg,
        ratePerKm,
        totalTransportCost: Number(totalTransportCost.toFixed(2)),
        transportCostPerKg: Number(transportCostPerKg.toFixed(2))
    };
}

module.exports = { calculateTransportCost };