import axios from "axios"
import orderModel from "../models/order.model.js";

const createOrderController = async(req,res)=>{

    try{

        // items which user has been selected in the cart to buy
        const userItems = req.body.items
        const {street,city,state,country,zipCode} = req.body.shippingAddress

        const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

            //getting user cart
            const userCart = await axios.get("http://localhost:5002/cart/item", {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }).then((data)=>data.data.cart)

            if(userCart.items.length==0){
                return res.status(404).json({
                    "mess":"No items found in cart"
                })
            }
            
            const selectedItemsFromCart = userCart.items.filter((item)=>userItems.includes(item.productId))

            //getting products from their respective productId
            const products = await Promise.all(

              selectedItemsFromCart.map(item =>
                axios.get(`http://localhost:5001/products/${item.productId}`,
                    {headers: {
                        Authorization: `Bearer ${token}`
                    }}
                ).then(res => res.data)

            ));
        
            // console.log(products);

            let totalPrice = 0
             
            //here making a product according to productModel where iterating on each selected product
            let items = selectedItemsFromCart.map((item)=>{
            
                // finding the  full product details of selected product
                let product = (products.find((product)=>product.product._id==item.productId)).product

                //so here item contains productId and quantity user have given
                //whereas product contains all the product details like it's price,stock details etc

                //if number of product required by user is greater than stock then throw error for it
                if(item.quantity>product.stock){
                    throw new Error(`Product ${product.title} is out of stock or insufficient stock`)
                }

                
                let itemTotal = product.price.amount * item.quantity
                totalPrice+=itemTotal
                
                return {
                    productId:product._id,
                    quantity:item.quantity,
                    price:{
                        amount:itemTotal,
                        currency:product.price.currency
                    }
                }

            })

            const order = await orderModel.create({
                userId:req.user.userId,
                items,
                totalAmount:{
                    amount:totalPrice,
                    currency:"INR"
                },
                status:"pending",
                shippingAddress:{street,city,state,country,zipCode}
            })

            console.log("Order created succesfully");
            
            res.status(201).json({
                order
            })   

        
    }catch(err){

            console.log(err);
                return res.status(500).json({
                    "mess":"Internal server error while creating the order"
                })
                
                
            }
    

    
}

async function getMyOrders(req, res) {
    const user = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        console.log(req.user);
        
        const orders = await orderModel.find({ userId: user.userId }).skip(skip).limit(limit).exec();
        const totalOrders = await orderModel.countDocuments({ userId: user.userId });
        console.log(orders);
        
        res.status(200).json({
            orders,
            meta: {
                total: totalOrders,
                page,
                limit
            }
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}



async function getOrderById(req, res) {
    const user = req.user;
    const orderId = req.params.id;

    try {
        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.userId.toString() !== user.userId) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this order" });
        }

        res.status(200).json({ order })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

async function cancelOrderById(req, res) {
    const user = req.user;
    const orderId = req.params.id;

    try {
        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.userId.toString() !== user.userId) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this order" });
        }

        // only PENDING orders can be cancelled
        if (order.status !== "pending") {
            return res.status(409).json({ message: "Order cannot be cancelled at this stage" });
        }

        order.status = "cancelled";
        await order.save();

        res.status(200).json({ order });
    } catch (err) {

        console.error(err);

        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}


async function updateOrderAddress(req, res) {
    const user = req.user;
    const orderId = req.params.id;

    try {
        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.userId.toString() !== user.userId) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this order" });
        }

        // only PENDING orders can have address updated
        if (order.status !== "pending") {
            return res.status(409).json({ message: "Order address cannot be updated at this stage" });
        }

        order.shippingAddress = {
            street: req.body.shippingAddress.street,
            city: req.body.shippingAddress.city,
            state: req.body.shippingAddress.state,
            zipCode: req.body.shippingAddress.zipCode,
            country: req.body.shippingAddress.country,
        };

        await order.save();

        res.status(200).json({ order });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export default {createOrderController,getMyOrders,getOrderById,cancelOrderById,updateOrderAddress}