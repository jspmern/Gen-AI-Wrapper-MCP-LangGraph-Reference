import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  firstName: string;
  lastName: string;
  email: string;
  position?: string;
  hiredAt?: Date;
  salary:number
  leave:number
}

const EmployeeSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: { type: String },
  hiredAt: { type: Date, default: Date.now },
  salary:{type:Number, required:true},
  leave:{type:Number, required:true}
});

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);
