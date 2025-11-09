import dotenv from "dotenv"
dotenv.config()
import connectToDb from "./src/db/db.js"
import app from "./src/app.js"

connectToDb()


app.listen(5000,()=>{
    console.log("App started running on 5000 port");
    
})
