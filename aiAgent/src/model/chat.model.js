import mongoose from "mongoose"

const chatSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","model"],
        default:"user"
    }
},{timestamps:true})

const chatModel = mongoose.model("chats",chatSchema)

export default chatModel