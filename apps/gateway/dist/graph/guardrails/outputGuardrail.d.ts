import { AIMessage } from "@langchain/core/messages";
import { MessagesState } from "../state";
export declare function outputPIIGuardrailNode(state: typeof MessagesState.State): Promise<{
    messages: AIMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>>[];
}>;
