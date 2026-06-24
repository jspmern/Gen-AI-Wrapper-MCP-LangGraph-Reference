
import { MultiServerMCPClient } from "@langchain/mcp-adapters";

export async function getMcpTools() {
  const client = new MultiServerMCPClient({
     hr: {
      transport: "http",
      url: "http://localhost:4201/mcp",
    },
    leave:{
       transport:"http",
       url:"http://localhost:4202/mcp"
    }
  });

  const tools = await client.getTools();

  return tools;
}
