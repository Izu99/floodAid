import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Auth disabled as per user request
    next();
};
