"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectedNode = rejectedNode;
const messages_1 = require("@langchain/core/messages");
async function rejectedNode(state) {
    const toolCall = state.pendingToolCall;
    const reason = state.approvalDecision?.reason || "Human rejected this action.";
    return {
        messages: [
            new messages_1.ToolMessage({
                tool_call_id: toolCall?.id || "unknown",
                content: `Tool execution rejected by human. Reason: ${reason}`,
            }),
        ],
        pendingToolCall: null,
        approvalDecision: null,
    };
}
