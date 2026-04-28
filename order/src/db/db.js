import mongoose from "mongoose";

const connectToDb = async ()=>{
    try{

        await mongoose.connect(process.env.MONGO_URI)
        console.log("Successfully connected to DB ☑️");
        

    }catch(err){
        console.log("Error connecting to DB ❌");
        console.log(err);
    }
}

export default connectToDb