const offerService = require("./offer.service");

const createOffer = async (req, res) => {
  try {
    const offer = await offerService.createOffer(req.body, req.user.id, req.user.name);
    res.status(201).json({
      success: true,
      message: "Offer submitted successfully",
      offer,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getFarmerOffers = async (req, res) => {
  try {
    const offers = await offerService.getOffersForFarmer(req.user.id);
    res.status(200).json({
      success: true,
      offers,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getBuyerOffers = async (req, res) => {
  try {
    const offers = await offerService.getOffersForBuyer(req.user.id);
    res.status(200).json({
      success: true,
      offers,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const counterOffer = async (req, res) => {
  try {
    const { counterPrice } = req.body;
    const offer = await offerService.counterOffer(req.params.id, counterPrice, req.user.id);
    res.status(200).json({
      success: true,
      message: "Counter offer submitted successfully",
      offer,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectOffer = async (req, res) => {
  try {
    const offer = await offerService.rejectOffer(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: "Offer declined",
      offer,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const acceptOffer = async (req, res) => {
  try {
    const result = await offerService.acceptOffer(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: "Deal accepted! A new order has been generated.",
      offer: result.offer,
      order: result.order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOffer,
  getFarmerOffers,
  getBuyerOffers,
  counterOffer,
  rejectOffer,
  acceptOffer,
};
