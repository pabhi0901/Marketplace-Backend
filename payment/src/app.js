import express from "express"
import dotenv from "dotenv"
const app = express()
dotenv.config()

//middleware
import cookieParser from "cookie-parser"

app.use(express.json())
app.use(cookieParser())

//routes
import paymentRoute from "./routes/payment.route.js"

app.use("/payment",paymentRoute)


export default app