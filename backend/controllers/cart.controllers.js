import Product from "../Models/product.model.js";

export const addToCart = async (req, res) =>{
  try {
    const { productId } = req.body;
    const user = req.user;

    console.log("Add to cart - productId:", productId);
    console.log("Add to cart - user:", user ? user.email : "No user");

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const existingItem = user.cartItems.find(item => item.product && item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += 1;
      console.log("Incremented quantity for existing item");
    } else {
      user.cartItems.push({ product: productId, quantity: 1 });
      console.log("Added new item to cart");
    }

    await user.save();
    console.log("Cart saved successfully");
    res.json(user.cartItems);
  }
   catch (error) {
    console.log("Error in addToCart controller:", error.message);
    console.log("Full error:", error);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const removeAllfromCart = async (req, res) =>{
 try{ 
    const {productId} = req.body;
    const user = req.user;
    if(!productId){
        user.cartItems = [];
    }
    else{
        user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);
    }
    await user.save();
    res.json(user.cartItems);
  }
  catch(error){
      console.log("Error in removeAllfromCart controller", error.message);
      res.status(500).json({ message: "server error", error: error.message });
  }
}

export const updateQuantity = async (req, res) =>{
    try {
        const {id:productId} = req.params;
        const {quantity} = req.body;
        const user = req.user;
        const existingItem = user.cartItems.find(item => item.product.toString() === productId);
        if(existingItem){
            if(quantity === 0){
                user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);
                await user.save();
                return res.json(user.cartItems);
            }
            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.log("Error in updateQuantity controller", error.message);
        res.status(500).json({ message: "server error", error: error.message });        
    }
}

export const getCartProducts = async (req, res) =>{
    try {
        console.log("=== Getting cart for user ===");
        console.log("User ID:", req.user?._id);
        console.log("User object exists:", !!req.user);
        console.log("User cartItems exists:", !!req.user?.cartItems);
        console.log("User cartItems length:", req.user?.cartItems?.length);

        // Check if user exists
        if (!req.user) {
            console.log("❌ No user found");
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Handle case where cartItems might be undefined or empty
        if (!req.user.cartItems || req.user.cartItems.length === 0) {
            console.log("✅ Cart is empty, returning empty array");
            return res.json([]);
        }

        // Filter out null or invalid items
        const validCartItems = req.user.cartItems.filter(item => item && item.product);
        console.log("Valid cart items:", validCartItems.length);

        if (validCartItems.length === 0) {
            console.log("✅ No valid items in cart, returning empty array");
            return res.json([]);
        }

        const productIds = validCartItems.map(item => item.product);
        console.log("Product IDs to fetch:", productIds);
        
        const products = await Product.find({_id: {$in: productIds}}); 
        console.log("Products found:", products.length);
        
        // add quantity to each product
        const cartItems = products.map((product) => {
            const item = validCartItems.find(cartItem => cartItem.product.toString() === product._id.toString());
            return {...product.toJSON(), quantity: item?.quantity || 1};
        });
        
        console.log("✅ Returning cart items:", cartItems.length);
        res.json(cartItems);
    } catch (error) {
        console.log("❌ Error in getCartProducts controller:", error.message);
        console.log("Error stack:", error.stack);
        res.status(500).json({ message: "server error", error: error.message });
    }
}; 

