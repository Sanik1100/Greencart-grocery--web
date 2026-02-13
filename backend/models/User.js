import mongoose from "mongoose";
const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    cartItems:{
        type: Object,
        default: {} // empty objects
    },
},{minimize: false})
const User= mongoose.models.user || mongoose.model('user',userSchema) // if user already exist then new user is created
export default User;