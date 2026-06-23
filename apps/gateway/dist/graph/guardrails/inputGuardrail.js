"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputGuardrailNode = inputGuardrailNode;
const messages_1 = require("@langchain/core/messages");
const constants_1 = require("./constants");
async function inputGuardrailNode(state) {
    const lastMessage = state.messages[state.messages.length - 1];
    const input = String(lastMessage.content ?? "").toLowerCase();
    const blockedWord = constants_1.BLOCKED_INPUT_KEYWORDS.find(word => input.includes(word.toLowerCase()));
    if (blockedWord) {
        return {
            messages: [
                new messages_1.AIMessage(`Request blocked by input guardrail. Found: ${blockedWord}`),
            ],
            guardrailBlocked: true,
        };
    }
    return {
        guardrailBlocked: false,
    };
}
