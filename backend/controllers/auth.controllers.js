import { redis } from "../lib/redis.js"
import User from "../Models/User.model.js"
import jwt, { decode } from "jsonwebtoken"

const generateTokens =(userId)=>{
    const accessToken = jwt.sign({userId},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"15m",
    })

    const refreshToken = jwt.sign({userId},process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:"7d",
    })
    return{ accessToken,refreshToken };
};

const storeRefreshToken = async(userId,refreshToken)=>{
    await redis.set(`refresh_token:${userId}`,refreshToken,"EX",7*24*60*60);//7 days
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // ✅ FIXED (was 'samesite')
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // ✅ FIXED (was 'samesite')
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
                                                                                                                                                                          
export const signup =async (req,res)=>{
    const {email,password,name } = req.body
        try {
            const userExists = await User.findOne({ email });

         if(userExists){
        return res.status(404).json({message : "User already exists"}); 
    }
    const user= await User.create({name,email,password,role:"admin"});

    //Authentication
    
    const { accessToken , refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id,refreshToken);

    setCookies(res,accessToken,refreshToken);

    res.status(201).json({ user:{
        _id: user._id,
        name: user.name,
        email :user.email,
        role:user.role
    },message : "User created successfully"

    })

    } catch (error) {

   console.error("Error in signup:", error);
   res.status(500).json({ message: "error occured", error: error.message });
  }
};

export const login = async (req, res) => {
  console.log("🔥 Login controller hit");
  console.log("Request body:", req.body);
    try {
		const { email, password } = req.body;
        console.log("Req body:", req.body);

		const user = await User.findOne({ email });
        console.log("Req body:", req.body);

		if (user && (await user.comparePassword(password))) {
			const { accessToken, refreshToken } = generateTokens(user._id);
			await storeRefreshToken(user._id, refreshToken);
			setCookies(res, accessToken, refreshToken);

			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			});
		} else {
			res.status(400).json({ message: "Invalid email or password" });
		}
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const logout =async (req,res)=>{
  try {
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken){
        const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        await redis.del(`refresh_token:${decoded.userId}`)
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({message : "Logged out successfully "})
    
  }catch (error) {
    console.log("Error in the logout controller",error.message);
    res.status(500).json({
        message:"server error",
        error:error.message
    });
  }  

}; 

export const refreshToken=async (req,res)=>{
    try{
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) {
        return res.json({
            message : "no refresh token produced"
        })
    }
    const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if(storedToken !== refreshToken){
        return res.json({
            message:"invalid refresh token"
        })
    }
    const accessToken = jwt.sign({userId : decoded.userId},process.env.ACCESS_TOKEN_SECRET,{expiresIn : "15m"});
    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge:15*60*1000,
    });
    res.json({ message: "token refreshed successfully"});
  }catch(error){
    console.log("error in refresh token controller",error.message)
    res.status(500).json({message : "server error", error:error.message});
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log("error in getProfile controller", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

