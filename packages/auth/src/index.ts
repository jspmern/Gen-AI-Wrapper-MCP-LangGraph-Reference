import jwt from "jsonwebtoken"
import {config} from '@company/config'
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

export * from './index'