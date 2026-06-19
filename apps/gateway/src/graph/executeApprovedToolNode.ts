import { ToolMessage } from "@langchain/core/messages";
import { MessagesState } from "./state";

export function createExecuteApprovedToolNode(hrTools: any[]) {
  return async function executeApprovedToolNode(
    state: typeof MessagesState.State
  ) {
    const toolCall = state.pendingToolCall;

    if (!toolCall) {
      return {
        messages: [
          new ToolMessage({
            tool_call_id: "unknown",
            content: "No approved tool call found.",
          }),
        ],
      };
    }

    const tool = hrTools.find(
      (item) => item.name === toolCall.name
    );

    if (!tool) {
      return {
        messages: [
          new ToolMessage({
            tool_call_id: toolCall.id,
            content: `Tool ${toolCall.name} not found.`,
          }),
        ],
      };
    }

    const result = await tool.invoke(toolCall.args);

    return {
      messages: [
        new ToolMessage({
          tool_call_id: toolCall.id,
          content:
            typeof result === "string"
              ? result
              : JSON.stringify(result),
        }),
      ],
      pendingToolCall: null,
      approvalDecision: null,
    };
  };
}