"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const langgraph_1 = require("@langchain/langgraph");
const state_1 = require("./state");
const openai_1 = require("@langchain/openai");
const config_1 = require("@company/config");
const client = new openai_1.OpenAI({
    model: "gpt-3.5-turbo-instruct",
    temperature: 0,
    maxTokens: undefined,
    timeout: undefined,
    maxRetries: 2,
    apiKey: config_1.config.OPENAI_API_KEY,
    // other params...
});
const checkpointer = new langgraph_1.MemorySaver();
async function llmCall(state) {
    console.log("hello i am messge", state.messages);
    const completion = await client.invoke(state.messages);
    return { messages: [completion] };
}
const agent = new langgraph_1.StateGraph(state_1.MessagesState)
    .addNode("llmCall", llmCall)
    .addEdge(langgraph_1.START, "llmCall")
    .addEdge("llmCall", langgraph_1.END)
    .compile({ checkpointer });
async function main() {
    const result = await agent.invoke({
        messages: [{ role: "system", content: "you are a utsav bot" }, { role: 'user', content: "hii" }],
    }, { configurable: { thread_id: "1" } });
    console.log('**', result);
}
