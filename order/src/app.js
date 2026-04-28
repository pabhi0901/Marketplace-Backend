import dotenv from "dotenv"
import express from "express"
const app = express()
dotenv.config()

//app level middlewares
import cookieParser from "cookie-parser"

//importing routes
import orderRoutes from "./routes/order.routes.js"

app.use(cookieParser())
app.use(express.json())

//using routes
app.use("/orders",orderRoutes)




export default app