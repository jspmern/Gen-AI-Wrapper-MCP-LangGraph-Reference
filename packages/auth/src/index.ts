import jwt from "jsonwebtoken"
import {config} from '@company/config'
import { Request, Response, NextFunction } from "express";
import { AsyncLocalStorage } from "async_hooks";

export type UserRole = "hr_admin" | "manager" | "employee";

type payloadType={
   userId?:number,
   email:string,
   role: UserRole
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
export function verifyJwtToken(token: string): payloadType {
  const decoded = jwt.verify(token, config.JWT_SECRET!) as payloadType;
  console.log('decode', decoded);
  return decoded;
}


 
/** for check valid token is available or not */

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
     
    /** this is for context throughout the one request */
      requestContext.run(
      {
        requestId: crypto.randomUUID(),
        user: {
          userId:Math.random().toFixed(),
          email: user.email ,
          role: user.role,
        },
      },
      () => next()
    );
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};


/** check RBAC */

export const toolPermissions: Record<string, UserRole[]> = {
  get_employee: ["hr_admin", "manager", "employee"],
  get_all_employee: ["hr_admin", "manager"],   
  create_employee: ["hr_admin"],
  update_employee: ["hr_admin"],
  delete_employee: ["hr_admin"],

  get_user_leave_info: ["hr_admin", "manager", "employee"],
  get_apply_leave_for_user: ["employee"],
};

export function checkPermission(toolName: string, role: UserRole) {
  const allowedRoles = toolPermissions[toolName];

  if (!allowedRoles) {
    throw new Error(`No RBAC config found for tool: ${toolName}`);
  }

  if (!allowedRoles.includes(role)) {
    throw new Error(`Access denied. Role ${role} cannot use ${toolName}`);
  }
}



 

export type AuthUser = {
  userId?: string;
  email: string;
  role: UserRole;
};

type RequestContext = {
  requestId: string;
  user: AuthUser;
};


/** this is for the context per request */
export const requestContext = new AsyncLocalStorage<RequestContext>();

export function getCurrentUser() {
  const store = requestContext.getStore();

  if (!store?.user) {
    throw new Error("No authenticated user found in request context");
  }

  return store.user;
}

export function getRequestId() {
  return requestContext.getStore()?.requestId;
}

export * from './index'