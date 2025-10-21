import express from "express";
import { getAllProduct ,getfeaturedProducts,createProduct,deleteProduct,getrecommendedProducts,getProductsByCategory, toggleFeaturedProduct} from "../controllers/product.controllers.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router=express.Router();

router.get("/",protectRoute,adminRoute,getAllProduct);
router.get("/featured",getfeaturedProducts);
router.get("/recommendation",getrecommendedProducts);
router.get("/category/:category",getProductsByCategory);
router.post("/",protectRoute,adminRoute,createProduct);
router.patch("/:id",protectRoute,adminRoute,toggleFeaturedProduct);
router.delete("/:id",protectRoute,adminRoute,deleteProduct);

export default router