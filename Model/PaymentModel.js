import mongoose from "mongoose";
const paymentSchema=new mongoose.Schema({
fullname:{
    type:String,
    required:true
},
phone:{
    type:String,
    required:true,
    
},
course_id:{
    type:String,
    required:true
},
user_id:
{
    type:String,
    required:true
},
amount:{
    type:Number,
    required:true
},
remark:{
    type:String,
    required:true
}

},{
    timestamps:true
})
const paymentModel=mongoose.model('payment',paymentSchema) 
export default paymentModel;