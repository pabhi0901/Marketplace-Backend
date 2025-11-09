import  mongoose from "mongoose"

const addressSchema = new mongoose.Schema({
    street:String,
    city:String,
    state:String,
    pincode:String,
    country:String,
    isDefault:{type:Boolean,default:false}
})


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String, 
        select:false //isse find ya findOne lagane pr ye read nhi hoga normally
    },
    fullname:{
        firstName:{ type:String,required:true},
        lastName:{  type:String }
    },
    role:{
        type:String,
        enum:['user','seller'],
        default:'user'
    },
    addresses:[addressSchema]
})

const userModel = mongoose.model('user',userSchema);

export default userModel;

