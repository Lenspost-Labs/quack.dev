import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { user } from '@prisma/client';

/**
 * Authenticating middleware
 * @param {object} req - the request object
 * @param {object} res - the response object
 * @param {function} next - the next function
 */

declare global {
  namespace Express {
    interface Request {
      user?: user; // Make it optional to avoid compilation errors when not authenticated
    }
  }
}

export default function authenticate(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized',
    });
  }

  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY as string);
    if (typeof decoded === 'object') {
      req.user = decoded as user;
      console.log(req.body, req.user.id)
      next();
    } else {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized',
      });
    }
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized',
    });
  }
}
