"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMcpTools = getMcpTools;
const mcp_adapters_1 = require("@langchain/mcp-adapters");
async function getMcpTools() {
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
