"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestContext = exports.toolPermissions = exports.authMiddleware = exports.generateJwtToken = void 0;
exports.verifyJwtToken = verifyJwtToken;
exports.checkPermission = checkPermission;
exports.getCurrentUser = getCurrentUser;
exports.getRequestId = getRequestId;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("@company/config");
const async_hooks_1 = require("async_hooks");
/** For generating the token */
const generateJwtToken = async (payload) => {
    const secretKey = config_1.config.JWT_SECRET;
    // Generate token expiring in 2 days
    const token = jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: '2d' });
    console.log('token', token);
    return token;
};
exports.generateJwtToken = generateJwtToken;
/** for verifying the token */
function verifyJwtToken(token) {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
    console.log('decode', decoded);
    return decoded;
}
/** for check valid token is available or not */
const authMiddleware = (req, res, next) => {
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
        exports.requestContext.run({
            requestId: crypto.randomUUID(),
            user: {
                userId: Math.random().toFixed(),
                email: user.email,
                role: user.role,
            },
        }, () => next());
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
};
exports.authMiddleware = authMiddleware;
/** check RBAC */
exports.toolPermissions = {
    get_employee: ["hr_admin", "manager", "employee"],
    get_all_employee: ["hr_admin", "manager"],
    create_employee: ["hr_admin"],
    update_employee: ["hr_admin"],
    delete_employee: ["hr_admin"],
    get_user_leave_info: ["hr_admin", "manager", "employee"],
    get_apply_leave_for_user: ["employee"],
};
function checkPermission(toolName, role) {
    const allowedRoles = exports.toolPermissions[toolName];
    if (!allowedRoles) {
        throw new Error(`No RBAC config found for tool: ${toolName}`);
    }
    if (!allowedRoles.includes(role)) {
        throw new Error(`Access denied. Role ${role} cannot use ${toolName}`);
    }
}
/** this is for the context per request */
exports.requestContext = new async_hooks_1.AsyncLocalStorage();
function getCurrentUser() {
    const store = exports.requestContext.getStore();
    if (!store?.user) {
        throw new Error("No authenticated user found in request context");
    }
    return store.user;
}
function getRequestId() {
    return exports.requestContext.getStore()?.requestId;
}
__exportStar(require("./index"), exports);
