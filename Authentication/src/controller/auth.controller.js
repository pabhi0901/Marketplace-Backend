import userModel from './../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
// import redis from "../db/redis.js"

const registerController = async function(req,res){
    
    const {username,email,password,fullname:{firstName,lastName},role="user"} = req.body;

    const userAlreadyExist = await userModel.findOne({
        $or: //$or will search in mongodb for user existing with having either username or email or both
        [
            {username}, 
            {email}
        ]
    })

    if(userAlreadyExist){
        return res.status(409).json({"message":"User already exist with this email or username"})
    }

    const hashPassword = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        password:hashPassword,
        email,
        role,
        fullname:{
            firstName,
            lastName
        }
    })

    const token = jwt.sign({
        userId:user._id,
        username:user.username,
        name:user.name,
        email:user.email,
        role:user.role
    },process.env.JWT_SECRET,{expiresIn:'1d'}) // this is the internal timer for jwt token, after 1 day if someone even tries to login with this token then it will be rejected.

    res.cookie("token",token,{
        httpOnly:true, //JavaScript (frontend) can’t read or modify the cookie.
        secure:true,   //Cookie is only sent over HTTPS, not plain HTTP.
        maxAge:24*60*60*1000 //1 day This controls how long the browser keeps the cookie before deleting it. After  that time, the browser won’t even send it with requests anymore. Means after 1 day it will be auto-deleted
    })

    res.status(201).json({
        message:"User registered Successfully",
        user:{
            id:user._id,
            fullname:user.fullname,
            username:user.username,
            email:user.email,
            role:user.role,
            addresses:user.addresses
        }
    })

    


}

const loginController = async function(req,res){
    const {username,password} = req.body

    const user = await userModel.findOne({
        $or:[{username:username},{email:username}]
    }).select("+password")

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if(!isPasswordCorrect){
        return res.status(401).json({
            "message":"Inccorect username or password"
        })
    }

    const token = jwt.sign({
        userId:user._id,
        username:user.username,
        name:user.name,
        email:user.email,
        role:user.role
    },process.env.JWT_SECRET,{expiresIn:'1d'})

      res.cookie("token",token,{
        httpOnly:true, //JavaScript (frontend) can’t read or modify the cookie.
        secure:true,   //Cookie is only sent over HTTPS, not plain HTTP.
        maxAge:24*60*60*1000 //1 day This controls how long the browser keeps the cookie before deleting it. After  that time, the browser won’t even send it with requests anymore. Means after 1 day it will be auto-deleted
        })

        console.log("User logged in suucessfully from backend");
        
        res.status(200).json({
            "mess":"user loggedIn Successfully",
            user:{
            id:user._id,
            fullname:user.fullname,
            username:user.username,
            email:user.email,
            role:user.role,
            addresses:user.addresses
            }
        })
}

const userDetails = async function(req,res){
    const user  = req.user
    res.status(200).json({
        "mess":"user details",
        user
    })
}

// const logoutController = async function(req,res){
//     const token = req.cookies.token
//     if(token){
//         await redis.set(`blacklist:${token}`,'true','EX',24*60*60);//delete it from database in 1 day because it will be invalid anyway after one day
//     }

//     res.clearCookie('token',{
//         httpOnly:true,
//         secure:true
//     })
//         console.log("User logged out from backend");
        
//     return res.status(200).json({
//         "mess":"User logged out Successfully"
//     })
// }

const getUserAddresses = async function(req,res){

    const {userId} = req.user

    const user = await userModel.findById(userId).select('addresses');

    if(!user){
        return res.status(404).json({
            "mess":"User not Found"
        })
    }

    return res.status(200).json({
        "mess":"User addresses fethched successfully",
        addresses:user
    })

}

const addUserAddress = async function (req,res){

    const {street,city,state,pincode,country,isDefault} = req.body

    // const user = req.user
    const user = await userModel.findByIdAndUpdate(req.user.userId,
    {
        $push:{
            addresses:{street,city,state,pincode,country,
            isDefault:isDefault?isDefault:false}
            }
    },
    {
        new:true
    })
    console.log("Address is saved in backend successfully");
    
    res.status(201).json({
        "message":"Address saved successfully",
        "address":user.addresses
    })
    
}

const deleteUserAddress = async function (req,res){


    const userId = req.user.userId;
    const {addressId} = req.params


    const addresses = await userModel.findByIdAndUpdate(userId,{
        $pull:{addresses:{_id:addressId}}
    },
    {new:true}).select("addresses")

    console.log("Deleted address successfully from db backend");
    

    res.status(201).json({
        "mess":"Address deleted successfully",
        addresses:addresses
    })




}



export {registerController,loginController,userDetails,addUserAddress,getUserAddresses,deleteUserAddress}