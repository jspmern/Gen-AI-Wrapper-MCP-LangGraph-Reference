 import { ToolMessage } from "@langchain/core/messages";
import { MessagesState } from "./state";

export async function rejectedNode(
  state: typeof MessagesState.State
) {
  const toolCall = state.pendingToolCall;

  const reason =
    state.approvalDecision?.reason || "Human rejected this action.";

  return {
    messages: [
      new ToolMessage({
        tool_call_id: toolCall?.id || "unknown",
        content: `Tool execution rejected by human. Reason: ${reason}`,
      }),
    ],
    pendingToolCall: null,
    approvalDecision: null,
  };
}