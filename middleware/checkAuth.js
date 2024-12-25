import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();
export const authVerify=async(req,res,next)=>{
try 
{
    const token=req.headers.authorization.split(" ")[1]
    const verify=jwt.verify(token,process.env.SECRET_KEY);

    console.log(verify);
    next(); 
    
    
} catch (error) {
 return res.json({
    status:false,
    message:error.message
 })    
}
}