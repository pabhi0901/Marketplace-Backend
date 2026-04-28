import cartModel from "../models/cart.model.js";
import { body } from 'express-validator';

const addItemtoCart = async (req,res)=>{

    const {productId,quantity} = req.body
    const {user} = req

    let cart = await cartModel.findOne({user:user.userId})

    if(!cart){
        cart = new cartModel({
            user:user.userId,
            items:[]
        })
    }

    const existingItemIndex = cart.items.findIndex((item)=>item.productId==productId)

    if(existingItemIndex>=0){
        cart.items[existingItemIndex].quantity+=quantity
    }
    else{
        cart.items.push({productId,quantity})
    }

    await cart.save()

    res.json({
        "mess":"Item added to cart successfully",
        cart
    })

}


const removeItems = async(req,res)=>{

    const user = req.user
    const {productId} = req.params

    let cart = await cartModel.findOneAndUpdate(
        //filtering object
        {
        user:user.userId
    },
        //updating object
    {
        $pull:{ 
            items:{
                
                productId
            
            }
        }
    },{new:true}
    )


    if(!cart){
        return res.status(404).json({
            "mess":"No item found"
        })
    }

    return res.status(200).json({
        "mess":"Item deleted successfully",
        cart
    })


}

const getCartItems = async(req,res)=>{

    const user = req.user

    const cart = await cartModel.findOne({user:user.userId})
    
    if(!cart){
        return res.status(404).json({
            "mess":"No cart found for this user"
        })
    }

    res.status(200).json({
        "mess":"User cart fetched successfully",
        cart
    })

}


export default {addItemtoCart,removeItems,getCartItems}