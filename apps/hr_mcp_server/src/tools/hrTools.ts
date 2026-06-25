 
import { z } from "zod";
import { createEmpController, deleteByIdController, getByIdController } from "../controller/employeeController";
import { checkPermission, getCurrentUser } from "@company/auth";
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
             const user=   getCurrentUser()
                checkPermission("get_employee", user.role)
            const  result = await getByIdController(id)
            const finalResult = JSON.stringify(result);
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
            description: "this is the tools for creating employee",
            inputSchema: {
                id: z.string().describe(
                    "Unique id for new employee"
                ),
                   firstName: z.string().describe(
                    "first name of employee"
                ),
                    lastName: z.string().describe(
                    "last name of employee"
                ),email: z.string().describe(
                    "unique email fo employee"
                ),
                    position: z.string().describe(
                    "position of employee i.e : manger , developer , team lead"
                ).optional(),
                    hireAt: z.string().describe(
                    "whiched date employee hired"
                ),
                    salary: z.number().describe(
                    "salray of employee per month "
                ),
                    leave: z.number().describe(
                    "credited leave numbers of employee"
                ),
            },
        },
        async ({ id,firstName,lastName,email,position="unknown", hireAt, salary,leave }:any) => {
               const user=   getCurrentUser()
                checkPermission("create_employee", user.role)
               const result= await createEmpController({ id,firstName,lastName,email,position, hireAt, salary,leave })
               const newUser=JSON.stringify(result)
            return {
                content: [
                    {
                        type: "text",
                        text: ` ${newUser} is created successfully `,
                    },
                ],
            };
        }
    )

    /** this is for the delete employee histroy by id */
     /** this is the tool for getting employee information by id */
    server.registerTool(
        "delete_employee",
        {
            description: "delete employee by id",
            inputSchema: {
                id: z.string().describe(
                    "This is the id for deleting user information"
                ),
            },
        },
        async ({ id }:{id:string}) => {
             const user=   getCurrentUser()
                checkPermission("delete_employee", user.role)
            const  result = await  deleteByIdController(id)
            const finalResult = JSON.stringify(result);
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