import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    price:{
        amount:{
            type:Number,
            required:true
        },
        currency:{
            type:String,
            enum:['INR','USD'],
            default:'INR'
        }
    },

    seller:{
        type:mongoose.Schema.Types.ObjectId, //yha 'ref' nhi denge kyuki user ka database compleately dusra hai  
        required:true
    },

    images:[
        {
            url:String,
            thumbnail:String,
            id:String
        }
    ],
    stock:{
        type:Number,
        default:0
    }

})

productSchema.index({title:'text',description:'text'})

export default mongoose.model('product',productSchema)
