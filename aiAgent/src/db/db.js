import mongoose from "mongoose"

const connectToDB = async()=>{

    try{

        await mongoose.connect(process.env.MONGO_URI)
        console.log("Successfully connected to DB ☑️");
        
    }catch(err){
        console.log(err)
        console.log("Error connecting to DB ❌")    

    }

}

export default connectToDB                  