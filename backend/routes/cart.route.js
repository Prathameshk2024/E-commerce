import express from "express";

const router=express.Router();
import { addToCart , removeAllfromCart,getCartProducts,updateQuantity} from "../controllers/cart.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

router.post("/",protectRoute,addToCart);
router.get("/",protectRoute,getCartProducts);
router.delete("/",protectRoute,removeAllfromCart);
router.put("/:id",protectRoute,updateQuantity);


export default router ;