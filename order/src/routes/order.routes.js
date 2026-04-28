import express from "express"
const router = express.Router()

//middleware
import createAuthMiddleware from "../middlewares/auth.middleware.js"

//controller
import orderController from "../controllers/order.controller.js"

//place an order from cart
router.post("/createOrder",createAuthMiddleware(["user"]),orderController.createOrderController)

router.get("/me", createAuthMiddleware([ "user" ]), orderController.getMyOrders)

router.post("/:id/cancel", createAuthMiddleware([ "user" ]), orderController.cancelOrderById)

router.patch("/:id/address", createAuthMiddleware([ "user" ]), orderController.updateOrderAddress)

router.get("/:id", createAuthMiddleware([ "user", "admin" ]), orderController.getOrderById)


export default router
