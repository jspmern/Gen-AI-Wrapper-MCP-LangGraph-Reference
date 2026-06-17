"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraph = createGraph;
exports.main = main;
const langgraph_1 = require("@langchain/langgraph");
const prebuilt_1 = require("@langchain/langgraph/prebuilt");
const openai_1 = require("@langchain/openai");
const messages_1 = require("@langchain/core/messages");
const state_1 = require("./state");
const config_1 = require("@company/config");
const hrMcpClient_1 = require("../mcp/hrMcpClient");
const checkpointer = new langgraph_1.MemorySaver();
async function createGraph() {
    const hrTools = await (0, hrMcpClient_1.getHrMcpTools)();
    const llm = new openai_1.ChatOpenAI({
        model: "gpt-4.1-mini",
        temperature: 0,
        apiKey: config_1.config.OPENAI_API_KEY,
    }).bindTools(hrTools);
    async function llmCall(state) {
        console.log("messages:", state.messages);
        const response = await llm.invoke([
            new messages_1.SystemMessage("You are Utsav HR bot. Use HR MCP tools when needed."),
            ...state.messages,
        ]);
        return {
            messages: [response],
        };
    }
    async function whereShouldGo(state) {
        const lastMessage = state.messages[state.messages.length - 1];
        const toolCalls = lastMessage.tool_calls;
        if (Array.isArray(toolCalls) && toolCalls.length > 0) {
            return "tools";
        }
        return langgraph_1.END;
    }
    const toolNode = new prebuilt_1.ToolNode(hrTools);
    const graph = new langgraph_1.StateGraph(state_1.MessagesState)
        .addNode("llmCall", llmCall)
        .addNode("tools", toolNode)
        .addEdge(langgraph_1.START, "llmCall")
        .addConditionalEdges("llmCall", whereShouldGo, {
        tools: "tools",
        [langgraph_1.END]: langgraph_1.END,
    })
        .addEdge("tools", "llmCall")
        .compile({
        checkpointer,
    });
    return graph;
}
async function main() {
    const agent = await createGraph();
    const result = await agent.invoke({
        messages: [
            {
                role: "user",
                content: "show me  detils of 6a3263090f95b18b83163a31 this id",
            },
        ],
    }, {
        configurable: {
            thread_id: "1",
        },
    });
    console.log("**", result);
    const lastMessage = result.messages[result.messages.length - 1];
    console.log("AI:", lastMessage.content);
}
