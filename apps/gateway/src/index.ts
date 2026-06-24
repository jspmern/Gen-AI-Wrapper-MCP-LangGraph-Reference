import { connectDatabase, Employee } from '@company/database';
import express from 'express'
const app= express();
import  {config} from "@company/config";
import { main } from './graph/graph';
import { generateJwtToken } from '@company/auth';
 
app.use(express.json());

/** this is the route place  */
app.get("/health",(req,res)=>{
   res.send({res:"okay ✅"})
}) 

app.get('/auth/login',async(req,res)=>{
   const email=config.USER_EMAIL
   const user = await Employee.findOne({ email })
   if (!user) return res.status(404).send({ msg: "User not found, please create user" })
   const payload = { email: user.email as string, role: user.position as string }
   const token = await generateJwtToken(payload)
    res.send({ token })
})
/**this is the listing the app */
app.listen(config.PORT,async ()=>{
   await connectDatabase()
   console.log(`server is connect at http://localhost:${config.PORT}`)
    main()
})
