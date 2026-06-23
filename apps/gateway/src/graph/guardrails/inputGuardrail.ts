import { AIMessage } from "@langchain/core/messages";
import { MessagesState } from "../state";
import { BLOCKED_INPUT_KEYWORDS } from "./constants";

export async function inputGuardrailNode(
  state: typeof MessagesState.State
) {
  const lastMessage = state.messages[state.messages.length - 1];

  const input = String(lastMessage.content ?? "").toLowerCase();

  const blockedWord = BLOCKED_INPUT_KEYWORDS.find(word =>
    input.includes(word.toLowerCase())
  );

  if (blockedWord) {
    return {
      messages: [
        new AIMessage(
          `Request blocked by input guardrail. Found: ${blockedWord}`
        ),
      ],
      guardrailBlocked: true,
    };
  }

  return {
    guardrailBlocked: false,
  };
}