"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHrResources = registerHrResources;
const database_1 = require("@company/database");
function registerHrResources(server) {
    server.registerResource("employee-directory", "employee://all", {
        title: "Employee Directory",
        description: "Returns all employee records"
    }, async (uri) => {
        const employees = await database_1.Employee.find({}).lean();
        console.log("hello i am employee", employees);
        return {
            contents: [
                {
                    uri: uri.href,
                    text: JSON.stringify(employees, null, 2)
                }
            ]
        };
    });
}
