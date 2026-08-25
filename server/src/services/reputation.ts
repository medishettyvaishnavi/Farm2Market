import { BuyerRating, Deal } from '../models/index.js';

export async function buyerReputation(buyerId: string) {
  const ratings = await BuyerRating.find({ buyer: buyerId }).select('-farmer').lean();
  const average = (field: string) => ratings.length ? Number((ratings.reduce((sum: number, item: any) => sum + item[field], 0) / ratings.length).toFixed(2)) : null;
  return { overallRating: average('overall'), completedDeals: await Deal.countDocuments({ buyer: buyerId, status: 'COMPLETED' }), paymentReliability: average('paymentReliability'), communication: average('communication'), agreementReliability: average('agreementReliability') };
}
