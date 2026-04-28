import axios from "axios"
import productMatching from "../service/productAnaliser.service.js"
import { Type } from "@google/genai"

const addToCartTool = async({q,minPrice=0,maxPrice,quantity},token)=>{

    let products 

    if(q && maxPrice){

        products = await axios.get(`http://localhost:5001/products/?q=${q}&minPrice=${minPrice}&maxPrice=${maxPrice}&limit=10`,
            {
                headers: {
                Authorization: `Bearer ${token}`
              }
            }
        ).then((res)=>res.data.data)
        
        
    }
    else{
        
        products = await axios.get(`http://localhost:5001/products/?q=${q}&minPrice=${minPrice}&limit=10`,
            {
                headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTMyOTM5MDc4YzgwZGUxMzA5MTIyODMiLCJ1c2VybmFtZSI6InNpbWE3NjV5dCIsImVtYWlsIjoic2ltYUBhLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzY2NDMyNTg0LCJleHAiOjE3NjY1MTg5ODR9.WUnVTcEgBr7x6KrA2J6czmRnLzf5NJG1QLIn6J70R24`
              }
            }
        ).then((res)=>res.data.data)
        
    }

    if(products.length==0){
        console.log(`${q} nhi mila bhai`);
        return `No ${q} founded in store`
    }
    let num = 0;
    let idHashArray = []

     let productsSummary = products.map((product)=>{
        idHashArray.push(product._id)
        return{
            price:product.price.amount,
            currency:product.price.currency,
            _id:num++,
            title:product.title,
            description:product.description
        }
    })

    let question = `
    User query:${q},minPrice=${minPrice},maxPrice:${maxPrice ? maxPrice: "Not provided"}
    Product list:${JSON.stringify(productsSummary)}`
    
    
   
    let selectedProductId =  await productMatching(question)
    

    let selectedProductMongoId = idHashArray[selectedProductId]
    
    try{
        const res = await axios.post("http://localhost:5002/cart/item/",
            {
                "productId":selectedProductMongoId,
                "quantity":quantity
            },
            {
                headers: {
                Authorization: `Bearer ${token}`
              }
            }
        )

        return res.data
        
    }
    catch(err){
        console.log(err);
        return err
    }


}

const tools = [{
    functionDeclarations:[
        {
            name:"addToCartTool",
            description:"Adds the item directly to cart, given by user",
            parameters:{
                type:Type.OBJECT,
                properties:{
                    q:{
                        type:Type.STRING,
                        description:"It is the name of product, if not cleared directly then it could be also description of product"
                    },
                    minPrice:{
                        type:Type.NUMBER,
                        description:"It is the minimum price of the item user wants the items to be."
                    },
                    maxPrice:{
                        type:Type.NUMBER,
                        description:"It is the maximum price user want product to be, product shouldn't exceed this amount"
                    },
                    quantity:{
                        type:Type.NUMBER,
                        description:"It is the number of quantity of items user wants to buy"
                    }
                },
                required:['q','quantity']
            }
        }
    ]
}]

export  {addToCartTool,tools}