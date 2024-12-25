import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
 institute_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    imageId:{
        type:String
    }
})
const userModel=mongoose.model("user",userSchema);
export default userModel;