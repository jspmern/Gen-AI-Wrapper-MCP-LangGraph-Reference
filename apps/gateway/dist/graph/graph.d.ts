import { AIMessage } from "@langchain/core/messages";
export declare function createGraph(): Promise<import("@langchain/langgraph").CompiledStateGraph<{
    guardrailBlocked: any;
    pendingToolCall: any;
    approvalDecision: any;
    messages: import("@langchain/core/messages").BaseMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>, import("@langchain/core/messages").MessageType>[];
}, {
    guardrailBlocked?: any;
    pendingToolCall?: any;
    approvalDecision?: any;
    messages?: import("@langchain/langgraph").OverwriteValue<import("@langchain/core/messages").BaseMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>, import("@langchain/core/messages").MessageType>[]> | import("@langchain/langgraph").Messages | undefined;
}, "tools" | "llmCall" | "toolGuardrail" | "approval" | "executeApprovedTool" | "reject" | "__start__" | "inputGuardrail", {
    guardrailBlocked: import("@langchain/langgraph").BaseChannel<any, any, unknown>;
    pendingToolCall: import("@langchain/langgraph").BaseChannel<any, any, unknown>;
    approvalDecision: import("@langchain/langgraph").BaseChannel<any, any, unknown>;
    messages: import("@langchain/langgraph").BaseChannel<import("@langchain/core/messages").BaseMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>, import("@langchain/core/messages").MessageType>[], import("@langchain/langgraph").OverwriteValue<import("@langchain/core/messages").BaseMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>, import("@langchain/core/messages").MessageType>[]> | import("@langchain/langgraph").Messages, unknown>;
}, {
    guardrailBlocked: import("@langchain/langgraph").BaseChannel<any, any, unknown>;
    pendingToolCall: import("@langchain/langgraph").BaseChannel<any, any, unknown>;
    approvalDecision: import("@langchain/langgraph").BaseChannel<any, any, unknown>;
    messages: import("@langchain/langgraph").BaseChannel<import("@langchain/core/messages").BaseMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>, import("@langchain/core/messages").MessageType>[], import("@langchain/langgraph").OverwriteValue<import("@langchain/core/messages").BaseMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>, import("@langchain/core/messages").MessageType>[]> | import("@langchain/langgraph").Messages, unknown>;
}, import("@langchain/langgraph").StateDefinition, {
    inputGuardrail: {
        messages: AIMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>>[];
        guardrailBlocked: boolean;
    } | {
        guardrailBlocked: boolean;
        messages?: undefined;
    };
    llmCall: {
        messages: import("@langchain/core/messages").AIMessageChunk<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>>[];
    };
    toolGuardrail: {
        guardrailBlocked: boolean;
        messages?: undefined;
    } | {
        guardrailBlocked: boolean;
        messages: AIMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>>[];
    };
    tools: any;
    approval: {
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
    };
    executeApprovedTool: {
        messages: import("@langchain/core/messages").ToolMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>>[];
        pendingToolCall?: undefined;
        approvalDecision?: undefined;
    } | {
        messages: import("@langchain/core/messages").ToolMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>>[];
        pendingToolCall: null;
        approvalDecision: null;
    };
    reject: {
        messages: import("@langchain/core/messages").ToolMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>>[];
        pendingToolCall: null;
        approvalDecision: null;
    };
}, unknown, unknown, []>>;
export declare function main(): Promise<void>;
