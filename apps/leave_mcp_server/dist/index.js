"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@company/config");
const auth_1 = require("@company/auth");
const database_1 = require("@company/database");
const express_1 = __importDefault(require("express"));
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const leaveToolHandler_1 = require("./tools/leaveToolHandler");
const PORT = config_1.config.LEAVE_PORT || 4202;
const app = (0, express_1.default)();
app.use(express_1.default.json());
function createServer() {
    const server = new mcp_js_1.McpServer({
        name: "hr-mcp-server",
        version: "1.0.0",
    });
    //tool registration
    (0, leaveToolHandler_1.leaveHrToolRegister)(server);
    return server;
}
app.get("/", (req, res) => {
    res.send({ message: `leave_mcp_server is up at ${PORT}` });
});
app.post("/mcp", auth_1.authMiddleware, async (req, res) => {
    console.log('leave mcp', req.user);
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
    console.log(`leave_mcp_server is connect at http://localhost:${config_1.config.LEAVE_PORT}`);
});
