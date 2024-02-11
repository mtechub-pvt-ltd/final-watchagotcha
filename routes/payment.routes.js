import { Router } from 'express';
import { verification } from '../Middleware/Verification.js';
import { createPayment, getAllPaymentByUser, getAllUsersPaymentDetails, savePaymentDetail } from '../Controllers/paymentController.js';
const paymentRoute = Router();


paymentRoute.post("/createPaymentIntent",verification,createPayment)
paymentRoute.post("/savePaymentDetail",verification,savePaymentDetail)
paymentRoute.get("/getAllPaymentsDetails",verification,getAllUsersPaymentDetails)
paymentRoute.get("/getAllPaymentByUser/:id",verification,getAllPaymentByUser)
export default paymentRoute;
