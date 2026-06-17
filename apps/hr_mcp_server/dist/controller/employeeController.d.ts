export declare const getByIdController: (id: string) => Promise<(import("mongoose").Document<unknown, {}, import("@company/database").IEmployee, {}, import("mongoose").DefaultSchemaOptions> & import("@company/database").IEmployee & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
export declare const createEmpController: ({ id, firstName, lastName, email, position, hireAt, salary, leave }: any) => Promise<import("mongoose").Document<unknown, {}, import("@company/database").IEmployee, {}, import("mongoose").DefaultSchemaOptions> & import("@company/database").IEmployee & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const deleteByIdController: (id: string) => Promise<(import("mongoose").Document<unknown, {}, import("@company/database").IEmployee, {}, import("mongoose").DefaultSchemaOptions> & import("@company/database").IEmployee & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
