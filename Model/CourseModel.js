import mongoose from "mongoose";
const courseSchema=new mongoose.Schema({
 
    course_id:{
    type:String,
        required:true,
        unique:true
 },
    course_name:{
        type:String,
        required:true,
        unique:true
    },
    course_price:{
        type:Number,
        required:true
    },
    course_description:{
        type:String,
        required:true
    },
    course_startingDate:{
        type:String,
        required:true
    },
    course_endDate:{
        type:String
    },
    course_thumbnail:{
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
    }


})
const courseModel=mongoose.model("course",courseSchema);
export default courseModel;