import jwt from "jsonwebtoken"
import {config} from '@company/config'
import { Request, Response, NextFunction } from "express";
 type payloadType={
    userId?:number,
    email:string,
    role:string
 }
 /** For generating the token */
export const  generateJwtToken=async(payload:payloadType)=>{
const secretKey =config.JWT_SECRET !
// Generate token expiring in 2 days
const token = jwt.sign(payload, secretKey, { expiresIn: '2d' });

console.log('token',token);
return token

}

/** for verifying the token */
export function verifyJwtToken(token: string) {
  const decoded = jwt.verify(
    token,
    config.JWT_SECRET !
  );
  console.log('decode',decoded)
  return decoded;
}


 

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const user = verifyJwtToken(token);

    (req as any).user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export * from './index'