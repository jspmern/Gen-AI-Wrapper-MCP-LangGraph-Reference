
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { hrToolHandler } from "./tools/hrTools.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from 'express'
import { config } from "@company/config";
import { connectDatabase } from "@company/database";
import { registerHrResources } from "./resources/hrResource.js";

/** create server  */
function createServer() {
    const server = new McpServer({
        name: "hr-mcp-server",
        version: "1.0.0",
    });
    //resource registration
    registerHrResources(server)
    //tool registration
    hrToolHandler(server)
    return server
}
const app=express()
app.use(express.json())
const PORT=config.HR_PORT

app.post(
    "/mcp",
    async (req, res) => {

        try {
            const transport =
                new StreamableHTTPServerTransport({
                    sessionIdGenerator: undefined,
                });

            const server =
                createServer();

            await server.connect(
                transport
            );

            await transport.handleRequest(
                req,
                res,
                req.body
            );

        } catch (error) {

            return res.status(401).json({
                message: "somthing wrong"
            });

        }

    }
);
app.listen(PORT, async () => {
    await connectDatabase()
    console.log(`server is connect http://localhost:${PORT}`)
})




