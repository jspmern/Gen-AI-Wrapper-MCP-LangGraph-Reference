export declare function createGraph(): Promise<import("@langchain/langgraph").CompiledStateGraph<{
    messages: import("@langchain/core/messages").BaseMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>, import("@langchain/core/messages").MessageType>[];
}, {
    messages?: import("@langchain/langgraph").Messages | import("@langchain/langgraph").OverwriteValue<import("@langchain/core/messages").BaseMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>, import("@langchain/core/messages").MessageType>[]> | undefined;
}, "tools" | "__start__" | "llmCall", import("@langchain/langgraph").StateSchema<{
    messages: import("@langchain/langgraph").ReducedValue<import("@langchain/core/messages").BaseMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>, import("@langchain/core/messages").MessageType>[], import("@langchain/langgraph").Messages>;
}>, import("@langchain/langgraph").StateSchema<{
    messages: import("@langchain/langgraph").ReducedValue<import("@langchain/core/messages").BaseMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>, import("@langchain/core/messages").MessageType>[], import("@langchain/langgraph").Messages>;
}>, import("@langchain/langgraph").StateDefinition, {
    llmCall: {
        messages: import("@langchain/core/messages").AIMessageChunk<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>>[];
    };
    tools: any;
}, unknown, unknown, []>>;
export declare function main(): Promise<void>;
