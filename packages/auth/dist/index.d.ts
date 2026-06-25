import { Request, Response, NextFunction } from "express";
import { AsyncLocalStorage } from "async_hooks";
export type UserRole = "hr_admin" | "manager" | "employee";
type payloadType = {
    userId?: number;
    email: string;
    role: UserRole;
};
/** For generating the token */
export declare const generateJwtToken: (payload: payloadType) => Promise<string>;
/** for verifying the token */
export declare function verifyJwtToken(token: string): payloadType;
/** for check valid token is available or not */
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/** check RBAC */
export declare const toolPermissions: Record<string, UserRole[]>;
export declare function checkPermission(toolName: string, role: UserRole): void;
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
export declare const requestContext: AsyncLocalStorage<RequestContext>;
export declare function getCurrentUser(): AuthUser;
export declare function getRequestId(): string | undefined;
export * from './index';
