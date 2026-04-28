import cookieParser from "cookie-parser"
import express from "express"

// importing routes
import productRoute from "./routes/product.route.js"

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use("/products",productRoute)


export default app