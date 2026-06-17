import mongoose, { Document } from 'mongoose';
export interface IEmployee extends Document {
    firstName: string;
    lastName: string;
    email: string;
    position?: string;
    hiredAt?: Date;
    salary: number;
    leave: number;
}
export declare const Employee: mongoose.Model<IEmployee, {}, {}, {}, mongoose.Document<unknown, {}, IEmployee, {}, mongoose.DefaultSchemaOptions> & IEmployee & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IEmployee>;
