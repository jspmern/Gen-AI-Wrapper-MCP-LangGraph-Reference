export declare const MessagesState: import("@langchain/langgraph").AnnotationRoot<{
    guardrailBlocked: import("@langchain/langgraph").BaseChannel<any, any, unknown>;
    pendingToolCall: import("@langchain/langgraph").BaseChannel<any, any, unknown>;
    approvalDecision: import("@langchain/langgraph").BaseChannel<any, any, unknown>;
    messages: import("@langchain/langgraph").BaseChannel<import("@langchain/core/messages").BaseMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>, import("@langchain/core/messages").MessageType>[], import("@langchain/langgraph").OverwriteValue<import("@langchain/core/messages").BaseMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>, import("@langchain/core/messages").MessageType>[]> | import("@langchain/langgraph").Messages, unknown>;
}>;
