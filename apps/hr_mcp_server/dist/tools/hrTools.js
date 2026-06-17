"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hrToolHandler = void 0;
const zod_1 = require("zod");
const employeeController_1 = require("../controller/employeeController");
const hrToolHandler = (server) => {
    /** this is the tool for getting employee information by id */
    server.registerTool("get_employee", {
        description: "this is the tool for getting specific employee details",
        inputSchema: {
            id: zod_1.z.string().describe("This is the id for getting the information of specific user"),
        },
    }, async ({ id }) => {
        const result = await (0, employeeController_1.getByIdController)(id);
        const finalResult = JSON.stringify(result);
        return {
            content: [
                {
                    type: "text",
                    text: finalResult,
                },
            ],
        };
    });
    /** this is the tool for creating employee  */
    server.registerTool("create_employee", {
        description: "this is the tools for creating employee",
        inputSchema: {
            id: zod_1.z.string().describe("Unique id for new employee"),
            firstName: zod_1.z.string().describe("first name of employee"),
            lastName: zod_1.z.string().describe("last name of employee"), email: zod_1.z.string().describe("unique email fo employee"),
            position: zod_1.z.string().describe("position of employee i.e : manger , developer , team lead").optional(),
            hireAt: zod_1.z.string().describe("whiched date employee hired"),
            salary: zod_1.z.number().describe("salray of employee per month "),
            leave: zod_1.z.number().describe("credited leave numbers of employee"),
        },
    }, async ({ id, firstName, lastName, email, position = "unknown", hireAt, salary, leave }) => {
        const result = await (0, employeeController_1.createEmpController)({ id, firstName, lastName, email, position, hireAt, salary, leave });
        const newUser = JSON.stringify(result);
        return {
            content: [
                {
                    type: "text",
                    text: ` ${newUser} is created successfully `,
                },
            ],
        };
    });
    /** this is for the delete employee histroy by id */
    /** this is the tool for getting employee information by id */
    server.registerTool("delete_employee", {
        description: "delete employee by id",
        inputSchema: {
            id: zod_1.z.string().describe("This is the id for deleting user information"),
        },
    }, async ({ id }) => {
        const result = await (0, employeeController_1.deleteByIdController)(id);
        const finalResult = JSON.stringify(result);
        return {
            content: [
                {
                    type: "text",
                    text: finalResult,
                },
            ],
        };
    });
};
exports.hrToolHandler = hrToolHandler;
