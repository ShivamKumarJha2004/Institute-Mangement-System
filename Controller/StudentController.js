import studentModel from "../Model/StudentModel.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv"
import jwt from "jsonwebtoken";
import paymentModel from "../Model/PaymentModel.js";
dotenv.config();

const addStudent=async(req,res)=>
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
        
                 const newStudent=await new studentModel({
                   course_id:req.body.courseId,
                   fullname:req.body.fullname,
                   email:req.body.email,
                   address:req.body.address,
                   phone:req.body.phone,
                  student_image:result.secure_url,
                   user_id:verify.email,
                   image_id:result.public_id
                 })    
                 await newStudent.save();
                 res.json({
                      success:true,
                      message:"Student added successfully",
                      newStudent
                 })    
        } catch (error) {
            res.json({
                success:false,
                message:error.message
            })
        }
        
}
const getallStudent=async(req,res)=>{
    try {
        const token=req.headers.authorization.split(" ")[1]
            const verify=jwt.verify(token,process.env.SECRET_KEY);
            const student=await studentModel.find({
                user_id:verify.email
            })
            if(!student)
            {
                return res.json({
                    status:false,
                    message:"cannot get student !!"
                })
            }
            return res.json({
               status:true,
               message:"Student fetch successfully",
               student
            })
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}
const getCourseStudent=async(req,res)=>{
    try {
        const token=req.headers.authorization.split(" ")[1]
            const verify=jwt.verify(token,process.env.SECRET_KEY);
     const student=await studentModel.find({
        user_id:verify.email,course_id:req.params.id.toString()
     })
     console.log(student);
     
     if(!student)
        {
            return res.json({
                status:false,
                message:"cannot get student !!"
            })
        }
        console.log(req.params.id);
        
        return res.json({
           status:true,
           message:"Student fetch successfully",
           student
        })
} catch (error) {
    res.json({
        success:false,
        message:error.message
    })
}

}
  
const deleteStudent=async(req,res)=>{
    try {
        const token=req.headers.authorization.split(" ")[1];
        const verify=jwt.verify(token,process.env.SECRET_KEY);
        const findStudent=await studentModel.findById({
            _id: req.params.id
            
       })
       if(findStudent)
           {
                if(findStudent.user_id===verify.email)
                   {
                       const studentDelete=await studentModel.deleteOne({
                        _id:req.params.id
                       })
                       if(studentDelete)
                       {
                     const imageDeleted = cloudinary.uploader.destroy(findStudent.image_id)
                     if(imageDeleted)
                        {
                            console.log("image deleted")
                        }   
                     res.json({
                             success:true,
                             message:"Student deleted Successfully !! ",
                             result:studentDelete
                        })
                       }
                   }    
           }    
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}
const updateStudent = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, process.env.SECRET_KEY);

        // Fetch the course by ID
        const findStudent = await studentModel.findById(req.params.id);

        if (!findStudent) {
            return res.json({
                success: false,
                message: "Course not found!",
            });
        }

        // Check if the user is authorized to update the course
        if (verify.email !== findStudent.user_id) {
            return res.json({
                success: false,
                message: "You are not eligible to update this course.",
            });
        }

        // Prepare updated data
        let updatedData = {
           
            fullname: req.body.fullname,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            student_image:findStudent.student_image, // Keep existing thumbnail if no new one
            user_id: verify.email,
            image_id:findStudent.image_id ,
        };
       

        // Handle file upload if files are present
        if (req.files && req.files.image) {
            // Delete the old image from Cloudinary
            const imageDeleted = await cloudinary.uploader.destroy(findStudent.image_id);
           
            if (imageDeleted) {
                
                const result = await cloudinary.uploader.upload(req.files.image.tempFilePath);
                if (result) {
                    
                    updatedData.student_image = result.secure_url;
                    updatedData.image_id = result.public_id;
                } else {
                    return res.json({
                        success: false,
                        message: "Failed to upload the new image.",
                    });
                }
            } else {
                return res.json({
                    success: false,
                    message: "Failed to delete the old image.",
                });
            }
        }

        
        const updateData = await studentModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (updateData) {
            return res.json({
                success: true,
                message: "student data updated successfully!",
                data: updateData,
            });
        } else {
            return res.json({
                success: false,
                message: "Failed to update the student data.",
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

const getlatestStudent=async(req,res)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, process.env.SECRET_KEY);
        const student=await studentModel.find({
            user_id:verify.email
        })
        if(student)
        {
          const sortData= student.sort({$natural:-1}).limit(5);
        if(sortData)
        {   
           return res.json({
                success:true,
                message:"Lastest five student fetched succefully",
                sortData
            })
        }
        else
        {
            return res.json({
                success:false,
                message:"Error in fetch data"
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
    export  {addStudent,getallStudent,getCourseStudent,deleteStudent,
        updateStudent,getlatestStudent};