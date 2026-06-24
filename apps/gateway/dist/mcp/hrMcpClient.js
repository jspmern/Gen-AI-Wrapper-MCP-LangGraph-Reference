"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHrMcpTools = getHrMcpTools;
const mcp_adapters_1 = require("@langchain/mcp-adapters");
async function getHrMcpTools() {
    const client = new mcp_adapters_1.MultiServerMCPClient({
        hr: {
            transport: "http",
            url: "http://localhost:4201/mcp",
        },
        leave: {
            transport: "http",
            url: "http://localhost:4202/mcp"
        }
    });
    const tools = await client.getTools();
    return tools;
}
