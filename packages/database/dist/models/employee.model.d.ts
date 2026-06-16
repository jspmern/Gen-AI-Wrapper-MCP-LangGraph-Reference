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
declare const _default: mongoose.Model<IEmployee, {}, {}, {}, mongoose.Document<unknown, {}, IEmployee, {}, mongoose.DefaultSchemaOptions> & IEmployee & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IEmployee>;
export default _default;
