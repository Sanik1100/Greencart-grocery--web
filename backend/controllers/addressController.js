import Address from "../models/Address.js";

// Add Address: /api/address/add
export const addAddress= async (req,res) => {
    try {
      const userId=req.body.userId; // use userId from auth middleware
      const {address}=req.body;
      if(!userId) return res.json({success:false, message:"Unauthorized"});
      await Address.create({...address, userId})
      res.json({ success: true, message:"Address added successfully"});  
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
        
    }
}
// Get Address: /api/address/get
export const getAddress= async (req,res) => {
try {
          // For GET requests, prioritize req.user.id over req.body.userId
        let userId;
        
        if (req.user && req.user.id) {
            userId = req.user.id;
        } else if (req.body && req.body.userId) {
            userId = req.body.userId;
        }
     if (!userId) {
            return res.json({ success: false, message: "User authentication required" });
        }
        
        console.log('Fetching addresses for userId:', userId); // Debug log

    const addresses= await Address.find({userId})
      console.log('Found addresses:', addresses.length); // Debug log
    res.json({ success: true, addresses});
    
} catch (error) {
    console.log('Get address error:',error);
    res.json({success: false,message: error.message});
}    
}