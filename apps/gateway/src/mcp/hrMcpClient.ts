 
 
import { MultiServerMCPClient } from "@langchain/mcp-adapters";

export async function getHrMcpTools() {
  const client = new MultiServerMCPClient({
     hr: {
      transport: "http",
      url: "http://localhost:4201/mcp",
    },
  });

  const tools = await client.getTools();

  return tools;
}
