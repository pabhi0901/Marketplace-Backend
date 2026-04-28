import mongoose from "mongoose"
import productModel from "../models/product.model.js"

import {uploadImage,deleteImage} from "../services/imagekit.service.js"

const addProductController = async function(req,res){

    const {title,description,priceAmount,priceCurrency="INR",stock=0} = req.body
    const imageCollection = req.files
    
    let price = {
        amount:Number(priceAmount),
        currency:priceCurrency
    }

    let seller = req.user.userId;
    // console.log(seller);
    
    
    let images = await Promise.all(imageCollection.map((image)=> uploadImage(image)))
    
    let product = await productModel.create({
        title,description,price,seller,images,stock:Number(stock)
    })

    res.status(200).json({
        "mess":"Product created successfully",
        product:product
    })
    

}

const queryProductController = async function(req,res){
try{
        
    const {q,minPrice,maxPrice, skip=0,limit=0} = req.query
    const filter = {}

    
    if(q){
        filter.$text = {$search:q} //it will search on the basis of text passed by user
    }
    if(minPrice){
        filter['price.amount'] = {...filter['price.amount'], $gte:Number(minPrice)} 
    }

    if(maxPrice){
        filter['price.amount'] = {...filter['price.amount'], $lte:Number(maxPrice)}
    }

    console.log(filter);
    
    const products = await productModel.find(filter).skip(Number(skip)).limit(Math.min(Number(limit),20))
    console.log(products);
    
    res.status(200).json({
        data:products
    })

}catch(err){
    res.status(500).json({
        "mess":"Some error occoured from our side, try again later"
    })
}
}

const getProductById = async function(req,res){

    const {id} = req.params

    const product = await productModel.findById(id)

    if(!product){
        return req.status(404).json({
            "mess":"No products found with this id"
        })
    }

    res.status(200).json({
        product
    })
    

}

const updateProductController = async function(req,res){

    const {id} = req.params

    let idValidation = mongoose.Types.ObjectId.isValid(id) //it only validates the id wheather it can be a mongoDb id or not, it doesn't check in database about the id

    if(!idValidation){
        return res.status(400).json({"mess":"Enter a valid id"})
    }

    const product = await productModel.findOne({ //also verifying that the product which is requested by seller to update is listed by that seller only 
        $and:[
            {_id:id,},
            {seller:req.user.userId}
        ]
    })

    if(!product){
        return res.status(401).json({
            "mess":"Seller can only edit it's own product."
        })
    }

    let allowedUpdates = ["title","description","price","stock"]

    for(let key in req.body){
        if(allowedUpdates.includes(key)){
            if(key=="price" && typeof(req.body.price)=="object"){
                if(req.body.price.amount!=undefined && req.body.price.amount>0){
                    product.price.amount = req.body.price.amount
                }
                else if(req.body.price.currency!=undefined ){
                    product.price.currency  = req.body.price.currency
                }
            }
            else if(key=="stock"){
                product[key] = Number(req.body[key])
            }
            else product[key] = req.body[key]
        }
    }




    await product.save()

    res.status(200).json({
        product
    })
    



 
}

const deleteProductController = async function(req,res){
    
    const {id} = req.params

    const idValidation = mongoose.Types.ObjectId.isValid(id)

     if(!idValidation){
        return res.status(400).json({"mess":"Enter a valid id"})
    }

    const product = await productModel.findOne({
        $and:[
            {_id:id},
            {seller:req.user.userId}
        ]
    })

    if(!product){
        return res.status(400).json({
            "mess":"You can only delete your own product"
        })
    }

    const images = product.images

    let deleted = await Promise.all(images.map(async (image)=>{
        try{
            console.log(image.id);
            
            await deleteImage(image.id)
        }catch(err){
            console.log("Error deleting product from imagekit ",err);
            
        }
    }))

    await product.deleteOne()
    
    res.status(200).json({
        "mess":"Product deleted successfully"
    })

}

const getAllproductsOfSeller = async function (req,res){

    const seller = req.user.userId

    const {skip, limit=20} = req.query

    const products = await productModel.find({seller}).skip(skip).limit(Math.min(20,limit))

    if(!products){
        res.status(404).json({
            "mess":"No product found"
        })
    }

    res.status(200).json({
        "mess":`Products of ${req.user.name} founded`,
        products
    })

}




export default {addProductController,queryProductController,getProductById,updateProductController,deleteProductController,getAllproductsOfSeller}