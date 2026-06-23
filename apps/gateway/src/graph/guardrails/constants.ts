export const BLOCKED_INPUT_KEYWORDS = [
  "bypass approval",
  "delete all employees",
  "hack",
  "leak salary",
  "ignore previous rules"
];
export const BLOCKED_TOOLS = [
  "deleteAllEmployees",
];

export const SENSITIVE_TOOLS = [
  "createEmployee",
  "updateEmployee",
  "deleteEmployee",
  "updateSalary",
];

export const PII_PATTERNS = {
  email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  phone: /\b\d{10}\b/g,
};