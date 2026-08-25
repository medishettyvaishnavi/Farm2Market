import { FarmerListing, Match } from '../models/index.js';

export async function findMatches(demand: any) {
  const listings = await FarmerListing.find({ active: true, crop: new RegExp(`^${demand.crop}$`, 'i'), quantity: { $gte: demand.quantity }, price: { $lte: demand.maxPrice }, distanceKm: { $lte: demand.radius } }).lean();
  return Promise.all(listings.map(async listing => Match.findOneAndUpdate({ demand: demand._id, listing: listing._id }, { demand: demand._id, listing: listing._id, score: Math.round(100 - (listing.distanceKm ?? 0) * 2 + (listing.smallFarmer ? 5 : 0)), reasons: ['crop', 'quantity', 'price', 'distance', 'availability', 'quality'] }, { upsert: true, new: true }).populate('listing')));
}
