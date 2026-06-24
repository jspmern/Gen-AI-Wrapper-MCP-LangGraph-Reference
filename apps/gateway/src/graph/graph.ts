import { Command, END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import readline from "readline/promises";
import { MessagesState } from "./state";
import { config } from "@company/config";
import { getMcpTools } from "../mcp/hrMcpClient";
import { APPROVAL_REQUIRED_TOOLS } from "./approvalNode";
import { approvalNode } from "./approvalTools";
 
import { rejectedNode } from "./rejectedNode";
import { createExecuteApprovedToolNode } from "./executeApprovedToolNode";
import { inputGuardrailNode } from "./guardrails/inputGuardrail";
import { toolGuardrailNode } from "./guardrails/toolGuardrail";
import { outputPIIGuardrailNode } from "./guardrails/outputGuardrail";
 

const checkpointer = new MemorySaver();

export async function createGraph() {
  const mcpTools = await getMcpTools();

  const llm = new ChatOpenAI({
    model: "gpt-4.1-mini",
    temperature: 0,
    apiKey: config.OPENAI_API_KEY,
  }).bindTools(mcpTools);

  async function llmCall(state: typeof MessagesState.State) {
    console.log("messages:", state.messages);

    const response = await llm.invoke([
      new SystemMessage("You are Utsav HR bot. Use HR MCP tools when needed."),
      ...state.messages,
    ]);

    return {
      messages: [response],
    };
  }
   
  async function routerAfterInputGuardrail(state : typeof MessagesState.State)
  {
    if (state.guardrailBlocked) {
      return END
    }
    return "llmCall"
  }

  async function routerAfterLlmCall(state: typeof MessagesState.State) {
    const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
    console.log('lastmessage',lastMessage)

    const toolCalls = (lastMessage as any).tool_calls ?? []
   if (!toolCalls.length) {
    return "outputPIIGuardrail";
  }

  return "toolGuardrail"
    
  }

  async function routerAfterToolGuardrail(state: typeof MessagesState.State) {
  if ((state as any).guardrailBlocked) {
    return END;
  }

  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
  const toolCalls = (lastMessage as any).tool_calls ?? [];

  if (!toolCalls.length) {
    return END;
  }

  const toolName = toolCalls[0].name;

  if (APPROVAL_REQUIRED_TOOLS.includes(toolName)) {
    return "approval";
  }

  return "tools";
}

  async function routerAfterApproval(state: typeof MessagesState.State){
    console.log("hello i  am router after apporval",state) 
    const approve =state.approvalDecision?.decision==="approved"
    if(approve)
    {
       return "executeApprovedTool";
    }
      return "reject"
     
  }
  const toolNode = new ToolNode(mcpTools);
  const executeApprovedToolNode =
    createExecuteApprovedToolNode(mcpTools);
 
  const graph = new StateGraph(MessagesState)
  .addNode("inputGuardrail", inputGuardrailNode)
  .addNode("llmCall", llmCall)
  .addNode("toolGuardrail", toolGuardrailNode)
  .addNode("tools", toolNode)
  .addNode("approval", approvalNode)
  .addNode("executeApprovedTool", executeApprovedToolNode)
  .addNode("reject", rejectedNode)
    .addNode("outputPIIGuardrail", outputPIIGuardrailNode)

  .addEdge(START, "inputGuardrail")

  .addConditionalEdges("inputGuardrail", routerAfterInputGuardrail, {
    llmCall: "llmCall",
    [END]: END,
  })

  .addConditionalEdges("llmCall", routerAfterLlmCall, {
    toolGuardrail: "toolGuardrail",
   outputPIIGuardrail: "outputPIIGuardrail"
  })

  .addConditionalEdges("toolGuardrail", routerAfterToolGuardrail, {
    tools: "tools",
    approval: "approval",
    [END]: END,
  })

  .addConditionalEdges("approval", routerAfterApproval, {
    executeApprovedTool: "executeApprovedTool",
    reject: "reject",
  })

  .addEdge("tools", "llmCall")
  .addEdge("executeApprovedTool", "llmCall")
  .addEdge("reject", "llmCall")
   .addEdge("outputPIIGuardrail", END)
  .compile({
    checkpointer,
  });

  return graph;
}

export async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const agent = await createGraph();
  const threadId = "hr-cli-thread-1";
  while (true) {
    const userInput = await rl.question("\nYou: ");
    if (userInput === "exit") {
      rl.close();
      process.exit(0);
       
    }
    const config = {
      configurable: {
        thread_id: threadId,
      },
    };
    const result: any = await agent.invoke(
      {
        messages: [new HumanMessage(userInput)],
      },
      config
    );
    console.log("**", JSON.stringify(result.__interrupt__));
    
    const interruptData = result.__interrupt__;

    if (interruptData?.length) {
      const approvalPayload = interruptData[0].value;

      console.log("\nHuman approval required:");
      console.log("Tool:", approvalPayload.toolName);
      console.log("Arguments:", approvalPayload.args);

      const answer = await rl.question(
        "\nApprove this action? yes/no: "
      );

      const resumeValue =
        answer.toLowerCase() === "yes"
          ? {
              decision: "approved",
              approvedBy: "utsav-cli",
            }
          : {
              decision: "rejected",
              rejectedBy: "utsav-cli",
              reason: "Rejected from CLI",
            };

      const resumedResult: any = await agent.invoke(
        new Command({
          resume: resumeValue,
        }),
        config
      );

      const lastMessage =
        resumedResult.messages[resumedResult.messages.length - 1];

      console.log("\nAI:", lastMessage.content);
      continue;
    }
    const lastMessage = result.messages[result.messages.length - 1];
    console.log("AI:", lastMessage.content);
  }
 
}

