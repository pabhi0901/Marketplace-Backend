import { createServer } from "http";
import connectToDB from "./src/db/db.js";
import connectToIoServer from "./src/socket/socket.server.js"
import app from "./src/app.js"
import dotenv from "dotenv"
dotenv.config()
connectToDB()


const httpServer = createServer(app);

connectToIoServer(httpServer)

httpServer.listen(5006);

