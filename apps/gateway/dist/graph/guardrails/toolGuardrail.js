"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolGuardrailNode = toolGuardrailNode;
const messages_1 = require("@langchain/core/messages");
async function toolGuardrailNode(state) {
    const lastMessage = state.messages[state.messages.length - 1];
    const toolCalls = lastMessage.tool_calls ?? [];
    if (!toolCalls.length) {
        return {
            guardrailBlocked: false,
        };
    }
    const toolName = toolCalls[0].name;
    console.log('inside tool guardrails', toolName);
    if (toolName === "delete_employee") {
        return {
            guardrailBlocked: true,
            messages: [
                new messages_1.AIMessage("deleteEmployee is blocked by guardrail."),
            ],
        };
    }
    return {
        guardrailBlocked: false,
    };
}
