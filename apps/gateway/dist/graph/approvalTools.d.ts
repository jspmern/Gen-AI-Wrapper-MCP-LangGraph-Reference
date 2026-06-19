import { MessagesState } from "./state";
export declare function approvalNode(state: typeof MessagesState.State): Promise<{
    approvalDecision: {
        decision: string;
        reason: string;
    };
    pendingToolCall?: undefined;
} | {
    pendingToolCall: {
        readonly type?: "tool_call";
        id?: string;
        name: string;
        args: Record<string, any>;
    };
    approvalDecision: any;
}>;
