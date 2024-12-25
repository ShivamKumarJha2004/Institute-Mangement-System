import express from "express"
import {addStudent,getallStudent,getCourseStudent,deleteStudent,updateStudent} from "../Controller/StudentController.js";
import { getlatestStudent } from "../Controller/StudentController.js";
import { authVerify } from "../middleware/checkAuth.js";
import { getoneStudent } from "../Controller/PaymentController.js";


const studentRoute=express.Router();

studentRoute.post('/add-student',authVerify,addStudent);
studentRoute.get('/get-student',authVerify,getallStudent)
studentRoute.get('/get-coursestudent/:id',authVerify,getCourseStudent)
studentRoute.delete('/delete-student/:id',authVerify,deleteStudent)
studentRoute.put('/update-student/:id',authVerify,updateStudent)
studentRoute.get('/latest-student',authVerify,getlatestStudent)
studentRoute.get('/student-details/:id',authVerify,getoneStudent);



export default studentRoute;
