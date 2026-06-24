"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMcpTools = getMcpTools;
const mcp_adapters_1 = require("@langchain/mcp-adapters");
const config_1 = require("@company/config");
async function getMcpTools() {
    const client = new mcp_adapters_1.MultiServerMCPClient({
        hr: {
            transport: "http",
            url: "http://localhost:4201/mcp",
            headers: {
                Authorization: `Bearer ${config_1.config.JWT_TOKEN}`,
            }
        },
        leave: {
            transport: "http",
            url: "http://localhost:4202/mcp",
            headers: {
                Authorization: `Bearer ${config_1.config.JWT_TOKEN}`,
            }
        }
    });
    const tools = await client.getTools();
    return tools;
}
