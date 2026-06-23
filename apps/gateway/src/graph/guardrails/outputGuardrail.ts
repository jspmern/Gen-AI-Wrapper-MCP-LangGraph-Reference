import { AIMessage } from "@langchain/core/messages";
import { MessagesState } from "../state";
function redactPII(text: string) {
  return text
    .replace(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      "[REDACTED_EMAIL]"
    )
    .replace(
      /\b(salary|ctc|package|income)\s*[:=-]?\s*(₹|rs\.?|inr)?\s*\d[\d,]*(\.\d+)?\s*(lpa|lakhs?|k|thousand)?\b/gi,
      "$1: [REDACTED_SALARY]"
    );
}

  export async function outputPIIGuardrailNode(state: typeof MessagesState.State) {
    const lastMessage = state.messages[state.messages.length - 1];
    const text = String(lastMessage.content ?? "");

    const safeText = redactPII(text);

    return {
      messages: [new AIMessage(safeText)],
    };
  }