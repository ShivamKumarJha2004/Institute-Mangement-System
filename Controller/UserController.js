import cloudinary from "cloudinary";
import dotenv from "dotenv";
import userModel from "../Model/UserModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET // Corrected key name
});

// Signup function
const signup = async (req, res) => {
    try {
        const { institute_name, email, password, phone } = req.body;

        // Validate required fields
        if (!institute_name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the required details."
            });
        }

        // Check if user already exists
        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                success: false,
                message: "User already exists."
            });
        }

        // Check if file exists
        if (!req.files || !req.files.image) {
            return res.status(400).json({
                success: false,
                message: "No image file provided."
            });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath);
        console.log("Cloudinary Upload Result:", result);

        const hasedPassword=await bcrypt.hash(password,10);
        // Create new user
        const newUser = new userModel({
           
            institute_name,
            email,
            phone,
            password:hasedPassword,
            imageUrl: result.secure_url,
            imageId: result.public_id
        });

        // Save new user to the database
        await newUser.save();

        // Respond with success message
        res.status(201).json({
            success: true,
            message: "New User Created Successfully!"
        });
    } catch (err) {
        // Log and send error response
        console.error("Error in signup:", err.message);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const login=async (req,res)=>{
    const {email,password,institute_name}=req.body;
    if(!email || !password)
    {
        return res.json({
            success:false,
            message:"please enter all login credentials"
        })
    }
    const user=await userModel.findOne({
        email
    })
    if(!user)
    {
        return res.json({
            success:false,
            message:"email is not registered"
        })
    }
    const passwordComp=await bcrypt.compare(password,user.password)
    if(!passwordComp)
    {
        return res.json({
            success:false,
            message:"incorrect password plz try again !!"
        })
    }
    const token = jwt.sign({
        email,institute_name,
    },process.env.SECRET_KEY,{
        expiresIn:'10d'
    })
    res.json({
        success:true,
        institute_name,
        email,
        token,
        user
        
    })
}

export  {signup,login};
