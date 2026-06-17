import { StateSchema } from "@langchain/langgraph";
export declare const MessagesState: StateSchema<{
    messages: import("@langchain/langgraph").ReducedValue<import("@langchain/core/messages").BaseMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>, import("@langchain/core/messages").MessageType>[], import("@langchain/langgraph").Messages>;
}>;
