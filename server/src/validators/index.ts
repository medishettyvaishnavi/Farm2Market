import { z } from 'zod';

export const buyerSchema = z.object({ name: z.string().min(2), mobile: z.string().regex(/^\d{10}$/), password: z.string().min(6), location: z.string().min(2) });
export const loginSchema = z.object({ mobile: z.string().regex(/^\d{10}$/), password: z.string().min(1) });
export const demandSchema = z.object({ crop: z.string().min(2), variety: z.string().optional().default(''), quantity: z.number().positive(), unit: z.string().min(1).default('kg'), quality: z.string().optional().default(''), targetPrice: z.number().nonnegative(), maxPrice: z.number().nonnegative(), location: z.string().min(2), radius: z.number().positive().default(10), requiredBy: z.coerce.date(), additionalRequirements: z.string().optional().default(''), status: z.enum(['OPEN', 'PAUSED', 'FULFILLED', 'CANCELLED']).default('OPEN') });
export const offerSchema = z.object({ listingId: z.string().min(1), demandId: z.string().min(1), quantity: z.number().positive(), price: z.number().positive(), note: z.string().max(1000).optional() });
export const messageSchema = z.object({ text: z.string().min(1).max(5000), offerId: z.string().optional(), event: z.enum(['TEXT', 'OFFER', 'COUNTER', 'ACCEPTED', 'REJECTED']).default('TEXT') });
export const ratingSchema = z.object({ dealId: z.string().min(1), overall: z.number().min(1).max(5), paymentReliability: z.number().min(1).max(5), communication: z.number().min(1).max(5), agreementReliability: z.number().min(1).max(5), note: z.string().max(1000).optional() });

export function parse<T>(schema: z.ZodType<T>, value: unknown) { const result = schema.safeParse(value); if (!result.success) { const error = new Error(result.error.issues.map(issue => issue.message).join(', ')); (error as Error & { statusCode: number }).statusCode = 400; throw error; } return result.data; }
