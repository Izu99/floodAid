import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'floodaid-secret-key-change-in-production';

export interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        console.log('🔐 Auth middleware - checking token');
        const authHeader = req.headers.authorization;
        console.log('Authorization header:', authHeader ? 'Present' : 'Missing');
        
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({ error: 'Authentication required' });
        }

        console.log('🔍 Verifying token...');
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.userId = decoded.userId;
        console.log('✅ Token valid, userId:', req.userId);
        
        next();
    } catch (error) {
        console.error('❌ Token verification failed:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
