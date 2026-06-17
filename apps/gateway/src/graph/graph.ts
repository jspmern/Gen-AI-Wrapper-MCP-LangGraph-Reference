 import openai from 'openai'
 import { END, START, StateGraph } from '@langchain/langgraph';
 import { MessagesState } from './state';

function llmCall()
{
    return {messages:["hello i am llm call"]}
}
const agent = new StateGraph(MessagesState)
  .addNode("llmCall", llmCall)
  .addEdge(START, "llmCall")
  .addEdge("llmCall",END)
  .compile();

 

export async function main()
{
   const result = await agent.invoke({
  messages: [{role:"system",content:"hello i am system design"}],
});

console.log('**',result)
}
