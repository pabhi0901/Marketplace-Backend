import express from "express"
const router = express.Router()

//middleware
import createAuthMiddleware from "../middlewares/auth.middleware.js"

//validator
import { validateAddToCart } from "../middlewares/cart.validator.js"

//controllers
import cartController from "../controllers/cart.controller.js"


//routes
// add or update an item in cart
router.post("/item", createAuthMiddleware(['user']),validateAddToCart,cartController.addItemtoCart)


//get cart of a user
router.get("/item",createAuthMiddleware(['user']),cartController.getCartItems)

//delete an item in cart
router.delete("/item/:productId",createAuthMiddleware(['user']),cartController.removeItems)




export default router