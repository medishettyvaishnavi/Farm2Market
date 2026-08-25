const User = require("../../models/User");
const Crop = require("../../models/Crop");
const Offer = require("../../models/Offer");
const Order = require("../../models/Order");

const getNgoDashboardStats = async () => {
  // Farmers
  const totalFarmers = await User.countDocuments({ role: "FARMER" });
  const verifiedFarmers = await User.countDocuments({ role: "FARMER", isVerified: true });
  const villagesList = await User.distinct("location", { role: "FARMER" });
  const activeFarmersCount = await Crop.distinct("owner").then((ids) => ids.length);

  // Buyers
  const totalBuyers = await User.countDocuments({ role: "BUYER" });
  const verifiedBuyers = await User.countDocuments({ role: "BUYER", isVerified: true });
  const activeBuyersCount = await Order.distinct("buyer").then((ids) => ids.length);

  // Transactions
  const totalTransactions = await Order.countDocuments();
  const completedTransactions = await Order.countDocuments({ orderStatus: "COMPLETED" });
  const pendingTransactions = await Order.countDocuments({
    orderStatus: { $nin: ["COMPLETED", "CANCELLED"] },
  });
  const cancelledTransactions = await Order.countDocuments({ orderStatus: "CANCELLED" });

  const totalValueRes = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);
  const totalTransactionValue = totalValueRes.length > 0 ? totalValueRes[0].total : 0;

  // Impact
  const benefitedFarmersCount = await Order.distinct("farmer", {
    orderStatus: "COMPLETED",
  }).then((ids) => ids.length);
  const totalRevenueRes = await Order.aggregate([
    { $match: { orderStatus: { $ne: "CANCELLED" } } },
    { $group: { _id: null, total: { $sum: "$estimatedNetEarnings" } } },
  ]);
  const totalFarmerRevenue = totalRevenueRes.length > 0 ? totalRevenueRes[0].total : 0;

  // Village wise analytics
  const villageStats = await Order.aggregate([
    {
      $group: {
        _id: "$village",
        transactions: { $sum: 1 },
        revenue: { $sum: "$estimatedNetEarnings" },
        farmers: { $addToSet: "$farmer" },
        cropsSold: { $push: "$cropName" },
      },
    },
    {
      $project: {
        village: "$_id",
        transactions: 1,
        revenue: 1,
        farmersCount: { $size: "$farmers" },
        cropsSold: 1,
      },
    },
  ]);

  const formattedVillageStats = villageStats.map((vs) => {
    // Find top crop
    const cropCounts = {};
    let topCrop = "N/A";
    let maxCount = 0;
    vs.cropsSold.forEach((c) => {
      cropCounts[c] = (cropCounts[c] || 0) + 1;
      if (cropCounts[c] > maxCount) {
        maxCount = cropCounts[c];
        topCrop = c;
      }
    });

    return {
      village: vs.village || "Unknown Village",
      farmers: vs.farmersCount,
      transactions: vs.transactions,
      topCrop: topCrop.split(" (")[0], // Strip local language translations for layout simplicity
      revenue: vs.revenue,
    };
  });

  // Crop-wise distribution (For analytics charts)
  const cropSalesDistribution = await Order.aggregate([
    { $match: { orderStatus: { $ne: "CANCELLED" } } },
    {
      $group: {
        _id: "$cropName",
        value: { $sum: "$totalAmount" },
        quantity: { $sum: "$quantity" },
      },
    },
  ]);

  const formattedCropSales = cropSalesDistribution.map((cs) => ({
    crop: cs._id.split(" (")[0],
    revenue: cs.value,
    quantity: cs.quantity,
  }));

  // Trend over time (Simulated monthly breakdown of actual orders)
  const timeTrends = await Order.aggregate([
    {
      $group: {
        _id: { $substr: ["$orderDate", 0, 7] }, // YYYY-MM
        count: { $sum: 1 },
        revenue: { $sum: "$estimatedNetEarnings" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const formattedTrends = timeTrends.map((t) => ({
    month: t._id,
    transactions: t.count,
    revenue: t.revenue,
  }));

  return {
    summary: {
      farmers: {
        total: totalFarmers,
        verified: verifiedFarmers,
        active: activeFarmersCount || totalFarmers,
        villages: villagesList.length || 1,
      },
      buyers: {
        total: totalBuyers,
        verified: verifiedBuyers,
        active: activeBuyersCount || totalBuyers,
      },
      transactions: {
        total: totalTransactions,
        completed: completedTransactions,
        pending: pendingTransactions,
        cancelled: cancelledTransactions,
        value: totalTransactionValue,
      },
      impact: {
        farmersBenefited: benefitedFarmersCount || Math.min(totalFarmers, totalTransactions),
        directTransactions: totalTransactions,
        totalFarmerRevenue,
        villagesCovered: villagesList.length || 1,
        cropsSold: formattedCropSales.length,
      },
    },
    villageStats: formattedVillageStats,
    cropSales: formattedCropSales,
    trends: formattedTrends,
  };
};

module.exports = {
  getNgoDashboardStats,
};
