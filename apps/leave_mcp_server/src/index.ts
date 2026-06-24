import { config } from "@company/config"
import { connectDatabase } from "@company/database"
import express from 'express'
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { leaveHrToolRegister } from "./tools/leaveToolHandler";
const PORT = config.LEAVE_PORT || 4202
const app = express()
app.use(express.json())

function createServer() {
    const server = new McpServer({
        name: "hr-mcp-server",
        version: "1.0.0",
    });


    //tool registration
    leaveHrToolRegister(server)
    return server
}



app.get("/", (req, res) => {
    res.send({ message: `leave_mcp_server is up at ${PORT}` })
})

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
    console.log(`leave_mcp_server is connect at http://localhost:${config.LEAVE_PORT}`)
})