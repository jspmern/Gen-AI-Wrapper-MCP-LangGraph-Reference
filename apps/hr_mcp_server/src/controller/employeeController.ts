import { Employee } from "@company/database";

export const getByIdController= async (id:string)=>{
   const result=  await Employee.findById(id);
   return result;
}

export const createEmpController= async ( {id,firstName,lastName,email,position,hireAt,salary,leave}:any)=>{
    const user= new Employee({id,firstName,lastName,email,position,hireAt,salary,leave})
               const newUser= await user.save()
               return newUser
}

 export const deleteByIdController= async (id:string)=>{
   const result=  await Employee.findByIdAndDelete(id);
   return result;
}