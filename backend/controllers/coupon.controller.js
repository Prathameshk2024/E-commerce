import {Coupon} from "../Models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    // First, check for user-specific coupon
    let coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
    
    // If no user-specific coupon, check for universal coupon
    if (!coupon) {
      coupon = await Coupon.findOne({ isUniversal: true, isActive: true });
    }
    
    res.json(coupon || null);
  } catch (error) {
    console.log("❌ Error in getCoupon:", error);
    res.status(500).json({ message: "Server error" });
  }  
}

export const validateCoupon = async (req, res) => {
    
    try {
        const {code}= req.body;
        
        // Check for user-specific coupon OR universal coupon
        const coupon = await Coupon.findOne({
          code: code,
          isActive: true,
          $or: [
            { userId: req.user._id },
            { isUniversal: true }
          ]
        });

        if(!coupon){
            return res.status(400).json({message:"Invalid coupon code"});
        }
        if(coupon.expirationDate < new Date()){
            coupon.isActive = false;
            await coupon.save();
            return res.status(400).json({message:"Coupon has expired"});
        }
        res.json({
            message:"Coupon is valid",
            code: coupon.code,
            discountPercentage : coupon.discountPercentage
        });
    } catch (error) {
        console.log("❌ Error in validateCoupon:", error);
        res.status(500).json({ message: "Server error" });
        
    }
}

// Test endpoint to generate a coupon for current user
export const generateTestCoupon = async (req, res) => {
  try {
    // Delete any existing coupon for this user
    await Coupon.findOneAndDelete({ userId: req.user._id });
    
    // Create new coupon
    const newCoupon = new Coupon({
      code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      discountPercentage: 10,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      userId: req.user._id,
      isActive: true
    });

    await newCoupon.save();
    
    res.json({
      message: "Test coupon generated successfully!",
      coupon: newCoupon
    });
  } catch (error) {
    console.log("❌ Error in generateTestCoupon:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Create a universal coupon available to all users
export const createUniversalCoupon = async (req, res) => {
  try {
    // Delete any existing universal coupon
    await Coupon.findOneAndDelete({ isUniversal: true });
    
    // Create new universal coupon
    const universalCoupon = new Coupon({
      code: "WELCOME10",
      discountPercentage: 10,
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      isUniversal: true,
      isActive: true
    });

    await universalCoupon.save();
    
    res.json({
      message: "Universal coupon created successfully!",
      coupon: universalCoupon
    });
  } catch (error) {
    console.log("❌ Error in createUniversalCoupon:", error);
    res.status(500).json({ message: "Server error" });
  }
}
