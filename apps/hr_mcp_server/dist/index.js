"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const hrTools_js_1 = require("./tools/hrTools.js");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const express_1 = __importDefault(require("express"));
const config_1 = require("@company/config");
const database_1 = require("@company/database");
const hrResource_js_1 = require("./resources/hrResource.js");
/** create server  */
function createServer() {
    const server = new mcp_js_1.McpServer({
        name: "hr-mcp-server",
        version: "1.0.0",
    });
    //resource registration
    (0, hrResource_js_1.registerHrResources)(server);
    //tool registration
    (0, hrTools_js_1.hrToolHandler)(server);
    return server;
}
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = config_1.config.HR_PORT;
app.post("/mcp", async (req, res) => {
    try {
        const transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
        });
        const server = createServer();
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    }
    catch (error) {
        return res.status(401).json({
            message: "somthing wrong"
        });
    }
});
app.listen(PORT, async () => {
    await (0, database_1.connectDatabase)();
    console.log(`server is connect http://localhost:${PORT}`);
});
