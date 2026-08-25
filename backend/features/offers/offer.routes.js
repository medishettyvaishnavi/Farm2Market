const express = require("express");
const { authenticate, authorizeRoles } = require("../../middleware/auth");
const {
  createOffer,
  getFarmerOffers,
  getBuyerOffers,
  counterOffer,
  rejectOffer,
  acceptOffer,
} = require("./offer.controller");

const router = express.Router();

router.post("/", authenticate, authorizeRoles("BUYER"), createOffer);
router.get("/farmer", authenticate, authorizeRoles("FARMER"), getFarmerOffers);
router.get("/buyer", authenticate, authorizeRoles("BUYER"), getBuyerOffers);
router.post("/:id/counter", authenticate, authorizeRoles("FARMER"), counterOffer);
router.post("/:id/reject", authenticate, authorizeRoles("FARMER"), rejectOffer);
router.post("/:id/accept", authenticate, authorizeRoles("FARMER"), acceptOffer);

module.exports = router;
