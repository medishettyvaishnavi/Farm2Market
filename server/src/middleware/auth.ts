import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';

export type Role = 'buyer' | 'farmer' | 'admin';
export type AuthUser = { id: string; role: Role };

declare global { namespace Express { interface Request { user?: AuthUser } } }

export function requireAuth(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    try {
      const payload = jwt.verify(token, env.jwtSecret) as AuthUser;
      if (roles.length && !roles.includes(payload.role)) return res.status(403).json({ error: 'Insufficient permissions' });
      req.user = payload;
      next();
    } catch { return res.status(401).json({ error: 'Invalid or expired token' }); }
  };
}

export function signToken(user: AuthUser) { return jwt.sign(user, env.jwtSecret, { expiresIn: '7d' }); }
