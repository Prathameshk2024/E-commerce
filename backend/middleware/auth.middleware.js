import jwt from "jsonwebtoken";
import User from "../Models/User.model.js";


export const protectRoute = async(req, res, next) =>{
    try {
        console.log("Cookies received:", req.cookies);
        const accessToken = req.cookies.accessToken;

        if(!accessToken){
            return res.status(401).json({message:"Unauthorized , access token missing"})
        }
        try {
            const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({message:"Unauthorized , user not found"})
        }

        req.user = user;

        next(); 
        } catch (error) {
            if(error.name === "TokenExpiredError"){
                return res.status(401).json({message:"Unauthorized , access token expired"})
            }
            throw error;
        }
    } catch (error) {
        console.log("Error in protectRoute middleware",error.message);
        res.status(401).json({message:"Unauthorized , invalid token"})
        
    }
} 
export const adminRoute = (req,res,next) =>{
    if(req.user && req.user.role === "admin"){
        next();
    }
    else{
        res.status(403).json({message:"Forbidden , admin access only"})
    }

}
