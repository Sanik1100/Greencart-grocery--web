import jwt from 'jsonwebtoken';
const authUser = async (req,res,next)=>{ // next will execute the controller function
    const {token}= req.cookies;
    if(!token){
        return res.json({ success: false, message: 'Not Authorized'});
    }
    try{
        const tokenDecode= jwt.verify(token, process.env.JWT_SECRET)
        if(tokenDecode.id){
             // Set user data on req.user (standard practice)
            req.user={
                id: tokenDecode.id
            };
           // Only set req.body.userId if req.body exists (for POST/PUT requests)
            if (!req.body) {
              req.body= {}; 
            }
             req.body.userId = tokenDecode.id;
        }else{
            return res.json({ success: false, message: 'Not authorized'});
        }
        next(); // executes the controller function
    }catch(error){
      console.error('Auth middleware error:', error);
        res.json({ success: false, message: error.message });

    }
}
export default authUser;
