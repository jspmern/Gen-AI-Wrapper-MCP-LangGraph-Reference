import { connectDatabase } from '@company/database';
import express from 'express'
const app= express();
import  {config} from "@company/config";
import { main } from './graph/graph';

/** this is the route place  */
app.get("/health",(req,res)=>{
   res.send({res:"okay ✅"})
}) 

/**this is the listing the app */
app.listen(config.PORT,async ()=>{
   await connectDatabase()
   console.log(`server is connect at http://localhost:${config.PORT}`)
    main()
})
