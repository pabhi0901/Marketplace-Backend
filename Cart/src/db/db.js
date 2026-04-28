import mongoose from "mongoose";

const connectToDb = async()=>{

    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Successfully connected to the DB");
    }
    catch(err){
        console.log("Error connecting to DB ",err);
    }

}

export default connectToDb