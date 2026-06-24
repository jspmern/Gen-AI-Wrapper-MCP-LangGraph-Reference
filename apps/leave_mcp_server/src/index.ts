import {config} from "@company/config"
import express from 'express'
const app=express()
app.use(express.json())
const PORT=config.LEAVE_PORT ||4202
app.get("/",(req,res)=>{
    res.send({message:`leave_mcp_server is up at ${PORT}`})
})
app.listen(PORT,()=>{
    
    console.log(`leave_mcp_server is connect at http://localhost:${config.LEAVE_PORT}`)
})