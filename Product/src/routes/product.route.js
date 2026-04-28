import express from "express"
import createAuthMiddleware from "../middleware/auth.middleware.js"
import multer from "multer"
import { createProductValidator } from "../validation/product.validator.js"
import productController from "../controller/product.controller.js"

const router = express.Router()
const upload = multer({storage:multer.memoryStorage()})


// Create product route with authenctication,validation, controller for now (only seller and admin can access this)
router.post(
  "/",
  createAuthMiddleware(["seller", "admin"]),
  upload.array("images", 5),
  createProductValidator,
  productController.addProductController
)

//this route is for quering product on basis different filters (text,price,)
router.get("/",
  createAuthMiddleware(['user','seller','admin']),
  productController.queryProductController)

//getting all products of a seller
router.get("/seller",
  createAuthMiddleware(['seller']),
  productController.getAllproductsOfSeller
)

// getting a product by its it
router.get("/:id",
    createAuthMiddleware(['user','seller','admin']),
    productController.getProductById
)


//to update pre-existing product
router.patch("/:id",
  createAuthMiddleware(['seller']),
  productController.updateProductController
)

//to delete a product
router.delete("/:id",
  createAuthMiddleware(['seller']),
  productController.deleteProductController
)


// router.post("/deleteProduct",productController.deleteProductController)



export default router 