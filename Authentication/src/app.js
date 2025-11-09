import express from "express"
import cookieParser from "cookie-parser"
const app = express()

//routes
import authRoute from "./routes/auth.routes.js"

//middlewares
app.use(cookieParser())
app.use(express.json())

app.use("/auth",authRoute)




export default app