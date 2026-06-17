import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, SystemMessage } from "@langchain/core/messages";

import { MessagesState } from "./state";
import { config } from "@company/config";
import { getHrMcpTools } from "../mcp/hrMcpClient";

const checkpointer = new MemorySaver();

export async function createGraph() {
  const hrTools = await getHrMcpTools();

  const llm = new ChatOpenAI({
    model: "gpt-4.1-mini",
    temperature: 0,
    apiKey: config.OPENAI_API_KEY,
  }).bindTools(hrTools);

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

async function whereShouldGo(state: typeof MessagesState.State) {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;

  const toolCalls = (lastMessage as any).tool_calls;
  if (Array.isArray(toolCalls) && toolCalls.length > 0) {
    return "tools";
  }

  return END;
}

  const toolNode = new ToolNode(hrTools);

  const graph = new StateGraph(MessagesState)
    .addNode("llmCall", llmCall)
    .addNode("tools", toolNode)
    .addEdge(START, "llmCall")
    .addConditionalEdges("llmCall", whereShouldGo, {
      tools: "tools",
    [END]: END,
    })
    .addEdge("tools", "llmCall")
    .compile({
      checkpointer,
    });

  return graph;
}

export async function main() {
  const agent = await createGraph();

  const result = await agent.invoke(
    {
      messages: [
        {
          role: "user",
          content: "show me  detils of 6a3263090f95b18b83163a31 this id",
        },
      ],
    },
    {
      configurable: {
        thread_id: "1",
      },
    }
  );

  console.log("**", result);

  const lastMessage = result.messages[result.messages.length - 1];
  console.log("AI:", lastMessage.content);
}

 