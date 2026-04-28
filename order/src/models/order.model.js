import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    
    items:[
        
        {
            productId:{
                
                type:mongoose.Schema.Types.ObjectId,
                required:true
            },
            quantity:{

                type:Number,
                default:1,
                min:1

            },
            price:{
                
                amount:{
                    type:Number,
                    required:true
                },
                currency:{
                    type:String,
                    enum:["USD","INR"],
                    required:true
                }

            }
        }
    ],

    totalAmount:{ 
       
                amount:{
                    type:Number,
                    required:true
                },
                currency:{
                    type:String,
                    enum:["USD","INR"],
                    required:true
                }

    },
    
    status:{
        type:String,
        enum:["pending","confirmed","shipped","delivered","cancelled"]
    },

    shippingAddress: {
    
        street: { type: String, required: true },
    
        city: { type: String, required: true },
    
        state: { type: String, required: true },
    
        country: { type: String, required: true },
    
        zipCode: { type: String, required: true }
    }
    
},{timeStamps:true})


const orderModel = mongoose.model("order",orderSchema)

export default orderModel