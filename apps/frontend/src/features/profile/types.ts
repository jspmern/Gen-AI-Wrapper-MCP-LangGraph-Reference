export type profileType={
    id:string,
    name:string,
    email:string,
    role: "admin" | "manager" | "employee",
    avatarUrl?:string  
}

export type profileResponseType<T>= {
    success:boolean,
    message:string,
    mockProfile:T

}