 import { Employee } from "@company/database";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerHrResources(
  server: McpServer
) {
  server.registerResource(
    "employee-directory",
    "employee://all",
    {
      title: "Employee Directory",
      description: "Returns all employee records"
    },
    async (uri) => {
        const employees = await Employee.find({}).lean()
        
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(
              employees,
              null,
              2
            )
          }
        ]
      };
    }
  );
}