
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import {config} from '@company/config'

export async function getMcpTools() {
  const client = new MultiServerMCPClient({
     hr: {
      transport: "http",
      url: "http://localhost:4201/mcp",
       headers: {
        Authorization: `Bearer ${config.JWT_TOKEN}`,
      }
    },
    leave:{
       transport:"http",
       url:"http://localhost:4202/mcp",
        headers: {
        Authorization: `Bearer ${config.JWT_TOKEN}`,
      }
    }
  });

  const tools = await client.getTools();

  return tools;
}
