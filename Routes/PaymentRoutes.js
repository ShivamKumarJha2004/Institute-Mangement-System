import express from "express"
import { addPayment } from "../Controller/PaymentController.js"
import { authVerify } from "../middleware/checkAuth.js";
import { getallPayment } from "../Controller/PaymentController.js";
import { getCoursePayement } from "../Controller/PaymentController.js";
const paymentRoute=express.Router()

paymentRoute.post('/add-payment',authVerify,addPayment);
paymentRoute.get('/get-payment',authVerify,getallPayment);
paymentRoute.get('/all-payment',authVerify,getCoursePayement);
export default paymentRoute;
