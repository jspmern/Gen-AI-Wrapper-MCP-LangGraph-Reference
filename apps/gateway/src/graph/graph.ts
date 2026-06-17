
 import { END, MemorySaver, START, StateGraph } from '@langchain/langgraph';
 import { MessagesState } from './state';
import { OpenAI } from "@langchain/openai"
import { config } from '@company/config';

const client = new OpenAI({
  model: "gpt-3.5-turbo-instruct",
  temperature: 0,
  maxTokens: undefined,
  timeout: undefined,
  maxRetries: 2,
  apiKey:config.OPENAI_API_KEY,
  // other params...
})

const checkpointer = new MemorySaver();


async function llmCall(state : typeof MessagesState.State )
{
  console.log("hello i am messge",state.messages)
  const completion = await client.invoke(state.messages)
    return {messages:[completion]}
}
const agent = new StateGraph(MessagesState)
  .addNode("llmCall", llmCall)
  .addEdge(START, "llmCall")
  .addEdge("llmCall",END)
  .compile({checkpointer});
 
export async function main()
{
   const result = await agent.invoke({
   messages: [{role:"system",content:"you are a utsav bot"},{role:'user',content:"hii"}],
},{ configurable: { thread_id: "1" } });

console.log('**',result)
}
