"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("@company/config");
async function connectDatabase() {
    const MONGODB_URI = config_1.config.MONGODB_URI || "mongodb://localhost:27017/ai_employee_mcp";
    try {
        const connection = await mongoose_1.default.connect(MONGODB_URI);
        console.log(`MongoDB Connected: ${MONGODB_URI}`);
    }
    catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
}
