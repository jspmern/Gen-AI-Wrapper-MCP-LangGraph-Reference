"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hrToolHandler = void 0;
const database_1 = require("@company/database");
const zod_1 = require("zod");
const hrToolHandler = (server) => {
    /** this is the tool for getting employee information by id */
    server.registerTool("get_employee", {
        description: "this is the tool for getting specific employee details",
        inputSchema: {
            id: zod_1.z.string().describe("This is the id for getting the information of specific user"),
        },
    }, async ({ id }) => {
        const findData = await database_1.Employee.findById(id);
        const finalResult = JSON.stringify(findData);
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
