import mongoose from "mongoose";
const studentSchema=new mongoose.Schema({
fullname:{
    type:String,
    required:true
},
phone:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
address:{
    type:String,
    required:true
},
course_id:{
    type:String,
    required:true
},
student_image:{
    type:String,
    require:true
},
user_id:
{
    type:String,
    required:true
},
image_id:{
    type:String,
    required:true
},


},{
    timestamps:true
})
const studentModel=mongoose.model('student',studentSchema) 
export default studentModel;