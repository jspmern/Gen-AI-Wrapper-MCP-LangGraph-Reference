"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraph = createGraph;
exports.main = main;
const langgraph_1 = require("@langchain/langgraph");
const prebuilt_1 = require("@langchain/langgraph/prebuilt");
const openai_1 = require("@langchain/openai");
const messages_1 = require("@langchain/core/messages");
const promises_1 = __importDefault(require("readline/promises"));
const state_1 = require("./state");
const config_1 = require("@company/config");
const hrMcpClient_1 = require("../mcp/hrMcpClient");
const approvalNode_1 = require("./approvalNode");
const approvalTools_1 = require("./approvalTools");
const rejectedNode_1 = require("./rejectedNode");
const executeApprovedToolNode_1 = require("./executeApprovedToolNode");
const inputGuardrail_1 = require("./guardrails/inputGuardrail");
const toolGuardrail_1 = require("./guardrails/toolGuardrail");
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
    async function routerAfterInputGuardrail(state) {
        if (state.guardrailBlocked) {
            return langgraph_1.END;
        }
        return "llmCall";
    }
    async function routerAfterLlmCall(state) {
        const lastMessage = state.messages[state.messages.length - 1];
        console.log('lastmessage', lastMessage);
        const toolCalls = lastMessage.tool_calls ?? [];
        if (!toolCalls.length) {
            return langgraph_1.END;
        }
        return "toolGuardrail";
    }
    async function routerAfterToolGuardrail(state) {
        if (state.guardrailBlocked) {
            return langgraph_1.END;
        }
        const lastMessage = state.messages[state.messages.length - 1];
        const toolCalls = lastMessage.tool_calls ?? [];
        if (!toolCalls.length) {
            return langgraph_1.END;
        }
        const toolName = toolCalls[0].name;
        if (approvalNode_1.APPROVAL_REQUIRED_TOOLS.includes(toolName)) {
            return "approval";
        }
        return "tools";
    }
    async function routerAfterApproval(state) {
        console.log("hello i  am router after apporval", state);
        const approve = state.approvalDecision?.decision === "approved";
        if (approve) {
            return "executeApprovedTool";
        }
        return "reject";
    }
    const toolNode = new prebuilt_1.ToolNode(hrTools);
    const executeApprovedToolNode = (0, executeApprovedToolNode_1.createExecuteApprovedToolNode)(hrTools);
    const graph = new langgraph_1.StateGraph(state_1.MessagesState)
        .addNode("inputGuardrail", inputGuardrail_1.inputGuardrailNode)
        .addNode("llmCall", llmCall)
        .addNode("toolGuardrail", toolGuardrail_1.toolGuardrailNode)
        .addNode("tools", toolNode)
        .addNode("approval", approvalTools_1.approvalNode)
        .addNode("executeApprovedTool", executeApprovedToolNode)
        .addNode("reject", rejectedNode_1.rejectedNode)
        .addEdge(langgraph_1.START, "inputGuardrail")
        .addConditionalEdges("inputGuardrail", routerAfterInputGuardrail, {
        llmCall: "llmCall",
        [langgraph_1.END]: langgraph_1.END,
    })
        .addConditionalEdges("llmCall", routerAfterLlmCall, {
        toolGuardrail: "toolGuardrail",
        [langgraph_1.END]: langgraph_1.END,
    })
        .addConditionalEdges("toolGuardrail", routerAfterToolGuardrail, {
        tools: "tools",
        approval: "approval",
        [langgraph_1.END]: langgraph_1.END,
    })
        .addConditionalEdges("approval", routerAfterApproval, {
        executeApprovedTool: "executeApprovedTool",
        reject: "reject",
    })
        .addEdge("tools", "llmCall")
        .addEdge("executeApprovedTool", "llmCall")
        .addEdge("reject", "llmCall")
        .compile({
        checkpointer,
    });
    return graph;
}
async function main() {
    const rl = promises_1.default.createInterface({
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
        const result = await agent.invoke({
            messages: [new messages_1.HumanMessage(userInput)],
        }, config);
        console.log("**", JSON.stringify(result.__interrupt__));
        const interruptData = result.__interrupt__;
        if (interruptData?.length) {
            const approvalPayload = interruptData[0].value;
            console.log("\nHuman approval required:");
            console.log("Tool:", approvalPayload.toolName);
            console.log("Arguments:", approvalPayload.args);
            const answer = await rl.question("\nApprove this action? yes/no: ");
            const resumeValue = answer.toLowerCase() === "yes"
                ? {
                    decision: "approved",
                    approvedBy: "utsav-cli",
                }
                : {
                    decision: "rejected",
                    rejectedBy: "utsav-cli",
                    reason: "Rejected from CLI",
                };
            const resumedResult = await agent.invoke(new langgraph_1.Command({
                resume: resumeValue,
            }), config);
            const lastMessage = resumedResult.messages[resumedResult.messages.length - 1];
            console.log("\nAI:", lastMessage.content);
            continue;
        }
        const lastMessage = result.messages[result.messages.length - 1];
        console.log("AI:", lastMessage.content);
    }
}
