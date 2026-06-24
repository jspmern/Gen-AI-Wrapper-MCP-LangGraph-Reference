import { Employee } from "@company/database";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";

export function leaveHrToolRegister(server: McpServer) {
  server.registerTool(
    "get_user_leave_info",
    {
      description:
        "by using id we will get the userInfo and send leave information",
      inputSchema: {
        id: z.string().describe("id for finding unique user"),
      },
    },
    async ({ id }) => {
      const findUser = await Employee.findById(id);
      let str = ``;
      findUser
        ? (str = str + `User Deatils : ${JSON.stringify(findUser)}`)
        : (str = str + `User with ${id} is not in database`);
      return {
        content: [
          {
            type: "text",
            text: str,
          },
        ],
      };
    },
  );
 server.registerTool(
  "get_apply_leave_for_user",
  {
    description:
      "Apply leave for an employee by employee id. It checks available leave balance before applying and applied the leave.",
    inputSchema: {
      id: z.string().describe("Employee id for finding unique user"),
      leave: z
        .number()
        .positive()
        .describe("Number of leave days employee wants to apply"),
    },
  },
  async ({ id, leave }) => {
    const employee = await Employee.findById(id);
    console.log(employee)

    if (!employee) {
      return {
        content: [
          {
            type: "text",
            text: `User not found with id: ${id}`,
          },
        ],
      };
    }

    if (employee.leave < leave) {
      return {
        content: [
          {
            type: "text",
            text: `Sorry, not enough leave available. Available leave: ${employee.leave}, requested leave: ${leave}.`,
          },
        ],
      };
    }

    employee.leave = employee.leave - leave;

    await employee.save();

    return {
      content: [
        {
          type: "text",
          text: `Leave applied successfully. Remaining leave: ${employee.leave}.`,
        },
      ],
    };
  }
);
}
