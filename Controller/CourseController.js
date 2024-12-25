import courseModel from "../Model/CourseModel.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv"
import jwt from "jsonwebtoken";
import studentModel from "../Model/StudentModel.js";
import mongoose from "mongoose";
import paymentModel from "../Model/PaymentModel.js";
dotenv.config();
const addCourse=async(req,res)=>
{
    try 
    {
        const token=req.headers.authorization.split(" ")[1]
        const verify=jwt.verify(token,process.env.SECRET_KEY);
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET // Corrected key name
        });
        const result=await cloudinary.uploader.upload(req.files.image.tempFilePath);
        console.log("Cloudinary Upload Result:", result);
    
             const newCourse=await new courseModel({
               course_id:req.body.courseId,
               course_name:req.body.coursename,
               course_price:req.body.courseprice,
               course_description:req.body.coursedescription,
               course_startingDate:req.body.courseStartingDate,
               course_endDate:req.body.courseEndDate,
               course_thumbnail:result.secure_url,
               user_id:verify.email,
               image_id:result.public_id
             })    
             await newCourse.save();
             res.json({
                  success:true,
                  message:"Course Saved Successfully",
                  newCourse
             })    
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
    
}
const getAllCourse=async(req,res)=>{
    try 
    {
        const token=req.headers.authorization.split(" ")[1];
        const verify=jwt.verify(token,process.env.SECRET_KEY);
       const courses=await courseModel.find({
        user_id:verify.email
       }) 
       if(!courses)
       {
         return res.json({
            success:false,
            message:"Account is not registered"
         })

       }
       return res.json({
        success:true,
        message:"All Course Fetch SuccessFully",
        courses
       })
    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
}
const getoneCourse=async(req,res)=>{
    try 
    {
        const token=req.headers.authorization.split(" ")[1];
        const verify=jwt.verify(token,process.env.SECRET_KEY);
       const courses=await courseModel.findOne({
        user_id:verify.email,course_id:req.params.id
       }) 
       if(!courses)
       {
         return res.json({
            success:false,
            message:"Account is not registered"
         })

       }
       return res.json({
        success:true,
        message:"Course Fetch SuccessFully",
        courses
       })
    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
}
const deleteCourse = async (req, res) => {
  try {
      const token = req.headers.authorization.split(" ")[1];
      const verify = jwt.verify(token, process.env.SECRET_KEY);

      // Find the course by course_id
      const findCourse = await courseModel.findOne({ course_id: req.params.id });

      if (findCourse) {
          // Check if the user is authorized to delete the course
          if (findCourse.user_id === verify.email) {
              // Delete the course
              const courseDelete = await courseModel.deleteOne({ course_id: req.params.id });

              if (courseDelete) {
                  // Delete the associated image from Cloudinary
                  const imageDeleted = await cloudinary.uploader.destroy(findCourse.image_id);

                  if (imageDeleted) {
                      console.log("Image deleted");

                      // Delete all students associated with the course
                      const studentDelete = await studentModel.deleteMany({ course_id: req.params.id });

                      if (studentDelete) {
                          return res.json({
                              success: true,
                              message: "Course and associated students deleted successfully!",
                          });
                      }
                  }
              }

              return res.json({
                  status: true,
                  message: "Course deleted successfully!",
              });
          } else {
              return res.status(403).json({
                  success: false,
                  message: "Unauthorized to delete this course",
              });
          }
      } else {
          return res.status(404).json({
              success: false,
              message: "Course not found",
          });
      }
  } catch (error) {
      res.status(500).json({
          success: false,
          message: error.message,
      });
  }
};

    //update put use kab krte hai jab hame sare data ko update krne hai , 
    //patch jaise kuch selective data ko update krne hai to 
    const updateCourse = async (req, res) => {
        try {
          const token = req.headers.authorization.split(" ")[1];
          const verify = jwt.verify(token, process.env.SECRET_KEY);
      
          // Validate `id` parameter
          if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid course ID!" });
          }
      
          // Fetch the course by ID
          const findCourse = await courseModel.findById(req.params.id);
          if (!findCourse) {
            return res.status(404).json({ success: false, message: "Course not found!" });
          }
      
          // Check user authorization
          if (verify.email !== findCourse.user_id) {
            return res.status(403).json({ success: false, message: "Unauthorized to update this course." });
          }
      
          // Prepare updated data
          let updatedData = {
            course_id: req.body.courseId,
            course_name: req.body.coursename,
            course_price: req.body.courseprice,
            course_description: req.body.coursedescription,
            course_startingDate: req.body.courseStartingDate,
            course_endDate: req.body.courseEndDate,
            course_thumbnail: findCourse.course_thumbnail,
            user_id: verify.email,
            image_id: findCourse.image_id,
          };
      
          // Handle file upload if files are present
          if (req.files?.image) {
            await cloudinary.uploader.destroy(findCourse.image_id);
      
            const result = await cloudinary.uploader.upload(req.files.image.tempFilePath);
            updatedData.course_thumbnail = result.secure_url;
            updatedData.image_id = result.public_id;
          }
      
          // Update the course
          const updateData = await courseModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });
          if (updateData) {
            return res.status(200).json({ success: true, message: "Course updated successfully!", data: updateData });
          }
      
          return res.status(500).json({ success: false, message: "Failed to update the course." });
        } catch (error) {
          return res.status(500).json({ success: false, message: error.message });
        }
      };   
    const getlatestCourse=async(req,res)=>{
        try {
            const token = req.headers.authorization.split(" ")[1];
            const verify = jwt.verify(token, process.env.SECRET_KEY);
            const course=await courseModel.find({
                user_id:verify.email
            })
            if(course)
            {
              const sortData= course.sort({$natural:-1}).limit(5);
            if(sortData)
            {   
               return res.json({
                    success:true,
                    message:"Lastest five course fetched succefully",
                    sortData
                })
            }
            else
            {
                return res.json({
                    success:false,
                    message:"Error in fetch course"
                })
            }
        }
            
    
        } catch (error) {
          res.json({
             success:false,
             message:error.message
          })  
        } 
    }
    
    const countTotal = async (req, res) => {
        try {
          // Extract and verify JWT
          const token = req.headers.authorization.split(" ")[1];
          const verify = jwt.verify(token, process.env.SECRET_KEY);
      
          // Fetch counts and filter by user ID
          const courseCount = await courseModel.countDocuments({ user_id: verify.email });
          const studentCount = await studentModel.countDocuments({ user_id: verify.email });
      
          // Aggregate total payment for the user
          const totalPayment = await paymentModel.aggregate([
            { $match: { user_id: verify.email } },
            {
              $group: {
                _id: null,
                totalAmount: { $sum: "$amount" }, // Assuming 'amount' field stores payment values
              },
            },
          ]);
      
          // Calculate total payment amount
          const paymentSum = totalPayment.length > 0 ? totalPayment[0].totalAmount : 0;
      
          // Send response
          return res.json({
            success: true,
            message: "Data fetched successfully",
            data: {
              totalCourses: courseCount,
              totalStudents: studentCount,
              totalAmountReceived: paymentSum,
            },
          });
        } catch (error) {
          console.error("Error fetching data:", error);
      
          // Handle errors
          return res.status(500).json({
            success: false,
            message: "An error occurred while fetching data",
            error: error.message,
          });
        }
      };
      
      
      
export  {addCourse,getAllCourse,getoneCourse,deleteCourse,updateCourse,getlatestCourse,countTotal};