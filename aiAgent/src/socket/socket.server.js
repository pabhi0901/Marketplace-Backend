import { Server } from "socket.io";
import jwt from "jsonwebtoken"
import cookie from "cookie"
import chatModel from "../model/chat.model.js";
import talkWithBuddy from "../service/userChat.service.js";

const connectToIoServer = (httpServer)=>{
 
    const io = new Server(httpServer);

    io.use((socket,next)=>{

        

        try{
        
            let cookies = socket.handshake.headers?.cookie
        
            cookies = cookie.parse(cookies)
        
            const token = cookies?.token
        
            if(!token){
                return next(new Error("No token found"));
            }
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            console.log("Ye mera user",decoded);
            
            socket.user = decoded
            socket.user.token=token
          
            next()

        }catch(err){
            console.log(err);
            console.log("Error connecting to socket ❎");
            return next(new Error("No authentication provided"))
        }
        
    })

    io.on("connection", (socket) => {

        console.log("Connected to server directly");
    
        socket.on("chat",async (chat)=>{
            
            const {message} = chat
            
            const userMessage = await chatModel.create({
                user:socket.user.userId,
                role:"user",
                message
            })
            
            let userHistory = await chatModel.find({ user: socket.user.userId })
            .sort({ createdAt: -1 })
            .limit(10);

            userHistory = userHistory.reverse()

            //History to send to model
            let History = userHistory.map((singleChat)=>{
            
                return {
                    
                    role: singleChat.role,
                    parts: [{ text: singleChat.message}],
                }
            })

            // History = JSON.stringify(History)

            const response = await talkWithBuddy(History,socket.user.token)

            socket.emit("aiResponse",{
                response
            })
            
            const savingResponse = await chatModel.create({
                user:socket.user.userId,
                role:"model",
                message:response
            })
    
        })

    });


}

export default connectToIoServer