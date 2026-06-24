import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
type payloadType = {
    userId?: number;
    email: string;
    role: string;
};
/** For generating the token */
export declare const generateJwtToken: (payload: payloadType) => Promise<string>;
/** for verifying the token */
export declare function verifyJwtToken(token: string): string | jwt.JwtPayload;
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export * from './index';
