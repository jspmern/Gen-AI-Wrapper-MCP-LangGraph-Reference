import { AIMessage } from "@langchain/core/messages";
import { MessagesState } from "../state";
export declare function toolGuardrailNode(state: typeof MessagesState.State): Promise<{
    guardrailBlocked: boolean;
    messages?: undefined;
} | {
    guardrailBlocked: boolean;
    messages: AIMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>>[];
}>;
