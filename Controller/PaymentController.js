import paymentModel from "../Model/PaymentModel.js"
import dotenv from "dotenv"
import studentModel from "../Model/StudentModel.js";
import courseModel from "../Model/CourseModel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
dotenv.config();

const addPayment=async(req,res)=>{
try {
        const token=req.headers.authorization.split(" ")[1]
        const verify=jwt.verify(token,process.env.SECRET_KEY);
        const payment=await new paymentModel({
           
            fullname:req.body.fullname,
            phone:req.body.phone,
            user_id:verify.email,
            course_id:req.body.courseId,
            amount:req.body.amount,
            remark:req.body.remark
  })
           await payment.save();
  res.json({
    success:true,
    message:"payment details save successfully",
    payment
  })
    
} catch (error) {
    res.json({
        success:false,
        message:error.message
    })
}
}
const getallPayment=async(req,res)=>{
      try {
        const token=req.headers.authorization.split(" ")[1]
        const verify=jwt.verify(token,process.env.SECRET_KEY);
        const allpayment=await paymentModel.find({user_id:verify.email})
        if(!allpayment)
        {
            return res.json({
                success:false,
                message:"payment not fetch successfully",

            })
        }
        return res.json({
            success:true,
            message:"Payment fetch successfully",
            allpayment
            
        })

      } catch (error) {
        return res.json({
            success:false,
            messgae:error.message
        })
      }   

}
const getCoursePayement=async(req,res)=>{
 try {
    console.log(req.query);
    
    const token=req.headers.authorization.split(" ")[1]
    const verify=jwt.verify(token,process.env.SECRET_KEY);
    const payment=await paymentModel.find({
     
       
        user_id:verify.email,
         //course_id:req.query.id,
         phone:req.query.phone
    })
    console.log(payment);
    if(!payment)
    {
        return res.json({
            success:false,
            message:"error in fetching the payment details"

        })
        
    }
    res.json({
        success:true,
        message:"payment fetch successfully !!",
        payment
    })
 } catch (error) {
    return res.json({
        success:false,
        message:error.message

    })
 }   
}



const getoneStudent = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, process.env.SECRET_KEY);

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }

    // Fetch the student by ID
    const student = await studentModel.findById(req.params.id);
    console.log("Student is:", student);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Fetch the fee details based on user ID and course ID
    const fee = await paymentModel.find({
      user_id: verify.email,
      course_id: student.course_id,
    });

    
    // Validate the `course_id` and fetch course details
    if (!student.course_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID!",
      });
    }

    const course = await courseModel.findOne({ course_id: student.course_id }); // Use `findOne` for querying by `course_id`

    if (!course) {
      return res.json({
        success: false,
        message: "Course details not found!",
      });
    }

    // Return success response with student, fee, and course details
    return res.json({
      success: true,
      studentDetails: student,
      feeDetails: fee,
      courseDetail: course,
    });
  } catch (error) {
    // Catch and handle any errors
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {addPayment,getallPayment,getCoursePayement,getoneStudent};