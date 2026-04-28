import app from "./src/app.js"
import connectToDb from "./src/db/db.js"


connectToDb()


app.listen(5005,()=>{
    console.log("Server is running on port 5005")
})