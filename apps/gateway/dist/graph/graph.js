"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const langgraph_1 = require("@langchain/langgraph");
const state_1 = require("./state");
function llmCall() {
    return { messages: ["hello i am llm call"] };
}
const agent = new langgraph_1.StateGraph(state_1.MessagesState)
    .addNode("llmCall", llmCall)
    .addEdge(langgraph_1.START, "llmCall")
    .addEdge("llmCall", langgraph_1.END)
    .compile();
async function main() {
    const result = await agent.invoke({
        messages: [{ role: "system", content: "hello i am system design" }],
    });
    console.log('**', result);
}
