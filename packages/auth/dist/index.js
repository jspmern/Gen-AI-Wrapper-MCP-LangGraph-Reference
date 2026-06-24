"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJwtToken = async () => {
    const payload = { userId: 123, role: 'admin' };
    const secretKey = 'your-secret-key'; // Store securely in .env
    // Generate token expiring in 2 days
    const token = jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: '2d' });
    console.log(token);
};
exports.generateJwtToken = generateJwtToken;
