import express from "express"
const router = express.Router()

//controllers
import {registerController,loginController,userDetails, addUserAddress,getUserAddresses, deleteUserAddress} from "../controller/auth.controller.js"

//middlewares
import authMiddleware from "../middleware/auth.middleware.js"

//validators
import {registerUserValidations,loginUserValidation, addressValidator} from "../middleware/validator.middleware.js"

//routes
router.post("/register",registerUserValidations,registerController)
router.post("/login",loginUserValidation,loginController)
// router.get("/logout",logoutController)

// this route returns the data of the user whenever it is asked
router.get("/getUserDetails",authMiddleware,userDetails)

//route to add, view and delete the address of a user
router.get("/users/me/addresses",authMiddleware,getUserAddresses)
router.post("/users/me/addresses",addressValidator,authMiddleware,addUserAddress)
router.delete("/users/me/deleteaddress/:addressId",authMiddleware,deleteUserAddress)


export default router