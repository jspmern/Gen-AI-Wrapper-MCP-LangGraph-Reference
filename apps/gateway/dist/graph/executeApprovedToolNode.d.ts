import { ToolMessage } from "@langchain/core/messages";
import { MessagesState } from "./state";
export declare function createExecuteApprovedToolNode(hrTools: any[]): (state: typeof MessagesState.State) => Promise<{
    messages: ToolMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>>[];
    pendingToolCall?: undefined;
    approvalDecision?: undefined;
} | {
    messages: ToolMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>>[];
    pendingToolCall: null;
    approvalDecision: null;
}>;
