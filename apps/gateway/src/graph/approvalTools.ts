import { AIMessage } from "@langchain/core/messages"
import { MessagesState } from "./state"
import { interrupt } from "@langchain/langgraph";

export async  function  approvalNode (state:typeof MessagesState.State){
    console.log("reached approval node")
      const lastMessage= state.messages[state.messages.length-1] as AIMessage
      const toolCall= lastMessage.tool_calls?.[0]
      if (!toolCall) {
      return {
      approvalDecision: {
        decision: "rejected",
        reason: "No tool call found",
      },
    };
  }
    const decision = interrupt({
    type: "human_approval",
    message: "Approve this HR action?",
    toolName: toolCall.name,
    args: toolCall.args,
  });
    return {
    pendingToolCall: toolCall,
    approvalDecision: decision,
  };
}