"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("hello how are you");
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
/** create server  */
const server = new mcp_js_1.McpServer({
    name: "hr-mcp-server",
    version: "1.0.0",
});
