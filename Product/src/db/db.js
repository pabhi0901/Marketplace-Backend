import mongoose from "mongoose";

const connectToDb  = async function(){

    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to DB successfully");
    }
    catch(err){
        console.log("error connecting to db ",err);
    }

}

export default connectToDb