import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import ApiError from '../errors/ApiError';
import { verifyToken } from '../utils/jwt';
import { envVars } from '../config/env';

const auth = (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token: string | undefined;

      // Get token from header, cookie, query, or body
      const rawAuthHeader = req.headers.authorization || req.headers.Authorization;
      if (Array.isArray(rawAuthHeader)) token = rawAuthHeader[0];
      else token = rawAuthHeader as string | undefined;

      token = token || (req.headers['x-access-token'] as string) || (req.cookies?.token as string);
      token = token || (req.query as any)?.token || (req.body as any)?.token;

      if (!token || token === 'null' || token === 'undefined') {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }

      // Remove 'Bearer ' prefix
      const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;

      // Verify token
      const verifiedUser = verifyToken(actualToken, envVars.jwt_Access_secret);
      
      // Normalize user object for consistent controller access
      req.user = {
        id: verifiedUser.id || verifiedUser.userId,
        email: verifiedUser.email,
        role: verifiedUser.role,
      };

      // Check roles (case-insensitive)
      if (requiredRoles.length) {
        const roleMatches = requiredRoles.some(
          (role) => role.toUpperCase() === verifiedUser.role.toUpperCase()
        );
        if (!roleMatches) {
          throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
