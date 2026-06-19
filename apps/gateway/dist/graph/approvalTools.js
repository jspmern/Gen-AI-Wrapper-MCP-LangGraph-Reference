"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approvalNode = approvalNode;
const langgraph_1 = require("@langchain/langgraph");
async function approvalNode(state) {
    console.log("reached approval node");
    const lastMessage = state.messages[state.messages.length - 1];
    const toolCall = lastMessage.tool_calls?.[0];
    if (!toolCall) {
        return {
            approvalDecision: {
                decision: "rejected",
                reason: "No tool call found",
            },
        };
    }
    const decision = (0, langgraph_1.interrupt)({
        type: "human_approval",
        message: "Approve this HR action?",
        toolName: toolCall.name,
        args: toolCall.args,
    });
    return {
        pendingToolCall: toolCall,
        approvalDecision: decision,
    };
}
