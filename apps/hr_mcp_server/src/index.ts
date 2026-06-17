console.log("hello how are you")
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { hrToolHandler } from "./tools/hrTools.js";
 

 /** create server  */
const server = new McpServer({
  name: "hr-mcp-server",
  version: "1.0.0",
});
 
 

 

 