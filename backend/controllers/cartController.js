import User from "../models/User.js";

// Update User CartData: /api/cart/update
export const updateCart=  async(req,res)=>{
    try {
        const userId=req.body.userId;  // authUser middleware already sets this
        const {cartItems}=req.body;
        if(!userId) return res.json({success:false, message:"Unauthorized"});
        await User.findByIdAndUpdate(userId,{cartItems})
        res.json({ success: true, message: "Cart updated"});
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message})
        
    }
}