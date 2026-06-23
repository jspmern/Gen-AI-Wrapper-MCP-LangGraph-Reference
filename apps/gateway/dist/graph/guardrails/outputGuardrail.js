"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputPIIGuardrailNode = outputPIIGuardrailNode;
const messages_1 = require("@langchain/core/messages");
function redactPII(text) {
    return text
        .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED_EMAIL]")
        .replace(/\b(salary|ctc|package|income)\s*[:=-]?\s*(₹|rs\.?|inr)?\s*\d[\d,]*(\.\d+)?\s*(lpa|lakhs?|k|thousand)?\b/gi, "$1: [REDACTED_SALARY]");
}
async function outputPIIGuardrailNode(state) {
    const lastMessage = state.messages[state.messages.length - 1];
    const text = String(lastMessage.content ?? "");
    const safeText = redactPII(text);
    return {
        messages: [new messages_1.AIMessage(safeText)],
    };
}
