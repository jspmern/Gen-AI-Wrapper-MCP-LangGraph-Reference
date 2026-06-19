import { ToolMessage } from "@langchain/core/messages";
import { MessagesState } from "./state";
export declare function rejectedNode(state: typeof MessagesState.State): Promise<{
    messages: ToolMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>>[];
    pendingToolCall: null;
    approvalDecision: null;
}>;
