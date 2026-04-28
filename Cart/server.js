import app from "./src/app.js"
import dotenv from "dotenv"
import connectToDb from "./src/db/db.js"
dotenv.config()


connectToDb()


app.listen(5002,()=>{
    console.log("Cart service is running on port 5002");
})