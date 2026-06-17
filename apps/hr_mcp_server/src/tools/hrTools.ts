import { Employee} from "@company/database"
import { z } from "zod";
export const hrToolHandler = (server:any): void => {
    /** this is the tool for getting employee information by id */
    server.registerTool(
        "get_employee",
        {
            description: "this is the tool for getting specific employee details",
            inputSchema: {
                id: z.string().describe(
                    "This is the id for getting the information of specific user"
                ),
            },
        },
        async ({ id }:{id:string}) => {
            const findData: unknown = await Employee.findById(id);
            const finalResult = JSON.stringify(findData);
            return {
                content: [
                    {
                        type: "text",
                        text: finalResult,
                    },
                ],
            };
        }
    )

    /** this is the tool for creating employee  */
     server.registerTool(
        "create_employee",
        {
            description: "this is the tool for getting specific employee details",
            inputSchema: {
                id: z.string().describe(
                    "This is the id for getting the information of specific user"
                ),
            },
        },
        async ({ id }:{id:string}) => {
            const findData: unknown = await Employee.findById(id);
            const finalResult = JSON.stringify(findData);
            return {
                content: [
                    {
                        type: "text",
                        text: finalResult,
                    },
                ],
            };
        }
    )
}