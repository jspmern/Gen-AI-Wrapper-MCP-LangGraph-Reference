"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PII_PATTERNS = exports.SENSITIVE_TOOLS = exports.BLOCKED_TOOLS = exports.BLOCKED_INPUT_KEYWORDS = void 0;
exports.BLOCKED_INPUT_KEYWORDS = [
    "bypass approval",
    "delete all employees",
    "hack",
    "leak salary",
    "ignore previous rules"
];
exports.BLOCKED_TOOLS = [
    "deleteAllEmployees",
];
exports.SENSITIVE_TOOLS = [
    "createEmployee",
    "updateEmployee",
    "deleteEmployee",
    "updateSalary",
];
exports.PII_PATTERNS = {
    email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    phone: /\b\d{10}\b/g,
};
