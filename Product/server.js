import dotenv from "dotenv"
dotenv.config()

import app from "./src/app.js"
import connectToDb from "./src/db/db.js"

connectToDb()

app.listen(5001,()=>{
    console.log("Server successfully started on port 5001");
    
})
