"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExecuteApprovedToolNode = createExecuteApprovedToolNode;
const messages_1 = require("@langchain/core/messages");
function createExecuteApprovedToolNode(hrTools) {
    return async function executeApprovedToolNode(state) {
        const toolCall = state.pendingToolCall;
        if (!toolCall) {
            return {
                messages: [
                    new messages_1.ToolMessage({
                        tool_call_id: "unknown",
                        content: "No approved tool call found.",
                    }),
                ],
            };
        }
        const tool = hrTools.find((item) => item.name === toolCall.name);
        if (!tool) {
            return {
                messages: [
                    new messages_1.ToolMessage({
                        tool_call_id: toolCall.id,
                        content: `Tool ${toolCall.name} not found.`,
                    }),
                ],
            };
        }
        const result = await tool.invoke(toolCall.args);
        return {
            messages: [
                new messages_1.ToolMessage({
                    tool_call_id: toolCall.id,
                    content: typeof result === "string"
                        ? result
                        : JSON.stringify(result),
                }),
            ],
            pendingToolCall: null,
            approvalDecision: null,
        };
    };
}
