import express from "express";
import {addCourse} from "../Controller/CourseController.js";
import {authVerify} from "../middleware/checkAuth.js"
import { getAllCourse } from "../Controller/CourseController.js";
import { getoneCourse } from "../Controller/CourseController.js";
import { deleteCourse } from "../Controller/CourseController.js";
import { updateCourse } from "../Controller/CourseController.js";
import { getlatestCourse } from "../Controller/CourseController.js";
import { countTotal } from "../Controller/CourseController.js";
const courseRoute=express.Router();
courseRoute.post('/add-course',authVerify,addCourse)
courseRoute.get('/get-course',authVerify,getAllCourse)
courseRoute.get('/get-course/:id',authVerify,getoneCourse)
courseRoute.delete('/delete-course/:id',authVerify,deleteCourse);
courseRoute.put('/update-course/:id',authVerify,updateCourse)
courseRoute.get('/latest-course',authVerify,getlatestCourse)
courseRoute.get('/total-count',authVerify,countTotal);
export default courseRoute;