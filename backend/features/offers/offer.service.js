const Offer = require("../../models/Offer");
const Crop = require("../../models/Crop");
const Order = require("../../models/Order");
const User = require("../../models/User");

const createOffer = async (offerData, buyerId, buyerName) => {
  const crop = await Crop.findById(offerData.cropId);
  if (!crop) {
    throw new Error("Crop not found");
  }

  const buyerUser = await User.findById(buyerId);
  const totalAmount = offerData.requestedQuantity * offerData.offeredPricePerUnit;

  return await Offer.create({
    crop: offerData.cropId,
    buyer: buyerId,
    buyerName: buyerName || buyerUser.name,
    buyerRating: 4.8, // Default rating for mockup
    requestedQuantity: offerData.requestedQuantity,
    unit: crop.unit,
    offeredPricePerUnit: offerData.offeredPricePerUnit,
    totalAmount,
    status: "pending",
    notes: offerData.notes || "",
  });
};

const getOffersForFarmer = async (farmerId) => {
  // Find all crops owned by this farmer
  const farmerCrops = await Crop.find({ owner: farmerId });
  const cropIds = farmerCrops.map((c) => c._id);

  // Return all offers on these crops
  return await Offer.find({ crop: { $in: cropIds } })
    .populate("crop")
    .populate("buyer", "name email phone location");
};

const getOffersForBuyer = async (buyerId) => {
  return await Offer.find({ buyer: buyerId })
    .populate("crop")
    .populate("buyer", "name email phone location");
};

const counterOffer = async (offerId, counterPrice, farmerId) => {
  const offer = await Offer.findById(offerId).populate("crop");
  if (!offer) {
    throw new Error("Offer not found");
  }

  if (offer.crop.owner.toString() !== farmerId.toString()) {
    throw new Error("Unauthorized to negotiate this offer");
  }

  offer.status = "countered";
  offer.farmerCounterPrice = Number(counterPrice);
  return await offer.save();
};

const rejectOffer = async (offerId, farmerId) => {
  const offer = await Offer.findById(offerId).populate("crop");
  if (!offer) {
    throw new Error("Offer not found");
  }

  if (offer.crop.owner.toString() !== farmerId.toString()) {
    throw new Error("Unauthorized to reject this offer");
  }

  offer.status = "rejected";
  return await offer.save();
};

const acceptOffer = async (offerId, farmerId) => {
  const offer = await Offer.findById(offerId).populate("crop");
  if (!offer) {
    throw new Error("Offer not found");
  }

  const crop = offer.crop;
  if (crop.owner.toString() !== farmerId.toString()) {
    throw new Error("Unauthorized to accept this offer");
  }

  // Update statuses
  offer.status = "accepted";
  await offer.save();

  crop.status = "sold";
  await crop.save();

  // Find users
  const farmerUser = await User.findById(farmerId);
  const buyerUser = await User.findById(offer.buyer);

  // Calculate logistics & earnings
  const finalPrice = offer.farmerCounterPrice || offer.offeredPricePerUnit;
  const totalAmount = finalPrice * offer.requestedQuantity;
  
  // Simulate distance and transport cost
  const distance = Math.floor(Math.random() * 40) + 5; // 5 to 45 km
  const transportCost = Math.floor(distance * 12 + 250); // base 250 + 12 per km
  const estimatedNetEarnings = totalAmount - transportCost;

  const orderDate = new Date().toISOString().split("T")[0];
  const expectedDate = new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0]; // +3 days

  const transactionId = "TXN_RTGS_" + Date.now() + "_" + Math.floor(1000 + Math.random() * 9000);

  // Create Order
  const order = await Order.create({
    crop: crop._id,
    cropName: crop.name,
    farmer: farmerId,
    buyer: offer.buyer,
    buyerName: buyerUser.name,
    quantity: offer.requestedQuantity,
    unit: crop.unit,
    pricePerUnit: finalPrice,
    totalAmount,
    transportCost,
    estimatedNetEarnings,
    orderDate,
    orderStatus: "ORDER_CREATED", // Initial status
    paymentStatus: "PAYMENT_PENDING",
    paymentMode: "Direct Bank RTGS Escrow",
    transactionId,
    pickupLocation: crop.location || farmerUser.location || "Farmer Farm Yard",
    deliveryLocation: buyerUser.location || "Buyer Mill Terminal",
    distance,
    estimatedTravelTime: `${Math.ceil(distance / 15)} hours`,
    pickupDate: new Date(Date.now() + 86400000).toISOString().split("T")[0], // +1 day
    expectedDeliveryDate: expectedDate,
    village: farmerUser.location || "Khammam Rural",
  });

  return { offer, order };
};

module.exports = {
  createOffer,
  getOffersForFarmer,
  getOffersForBuyer,
  counterOffer,
  rejectOffer,
  acceptOffer,
};
