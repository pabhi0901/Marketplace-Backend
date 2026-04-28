import cookieParser from "cookie-parser"
import express from "express"
const app = express()
app.use(express.json())
app.use(cookieParser())

//import routes
import cartRoute from "./routes/cart.route.js"

app.use("/cart",cartRoute)

export default app


