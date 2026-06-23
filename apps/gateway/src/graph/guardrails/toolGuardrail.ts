import { AIMessage } from "@langchain/core/messages";
import { MessagesState } from "../state";

 export async function toolGuardrailNode(state: typeof MessagesState.State) {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
  const toolCalls = (lastMessage as any).tool_calls ?? [];

  if (!toolCalls.length) {
    return {
      guardrailBlocked: false,
    };
  }

  const toolName = toolCalls[0].name;
  console.log('inside tool guardrails',toolName)

  if (toolName === "delete_employee") {
    return {
      guardrailBlocked: true,
      messages: [
        new AIMessage("deleteEmployee is blocked by guardrail."),
      ],
    };
  }

  return {
    guardrailBlocked: false,
  };
}