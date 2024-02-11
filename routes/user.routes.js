import { Router } from 'express';
import { ResetPasswordLinkValidate, blockUnblockUser, cancelSubsciptionEmail, cancelSubscription, changePassword, countUsersByMonth, createSubscription, deleteAllUsers, deleteUser, forgetPassword, getAdminDashboardStats, getAllDataOfDeletedUser, getAllDeleteUsers, getAllSubscribedUser, getAllUsers, getAllUsersByYears, getSpecificUser, getUserStats, login, register, resetPassword, restoreUser, searchUsers, sendSubsciptionEmail, sendWellcomeEmail, updateProfile, uploadImage, verifyOtp } from '../Controllers/userController.js';
import { upload } from '../utils/ImageHandler.js';
import { verification } from '../Middleware/Verification.js';
import { SubscriptionEmail } from '../utils/EmailTemplates.js';
const userRoute = Router();
// userRoute.get('/verifyToken', verifyToken);
userRoute.post('/login', login);
userRoute.post('/register', register);
userRoute.post('/uploadImage', uploadImage);

// userRoute.post('/uploadImage',upload("userImage").single("image"), uploadImage);
userRoute.post("/forgetPassword",forgetPassword)
userRoute.post("/verifyOtp",verifyOtp)
userRoute.post("/reset_password",resetPassword)
userRoute.post("/changePassword",verification,changePassword)
userRoute.post("/validate_reset_password_link",ResetPasswordLinkValidate)
userRoute.post("/updateUserProfile",verification,updateProfile)
userRoute.get("/getUser/:id",verification,getSpecificUser)
userRoute.get("/getAllUsers",verification,getAllUsers)
userRoute.get("/getAllUsersByYear",verification,countUsersByMonth)
userRoute.delete("/deleteUser/:id",verification,deleteUser)
userRoute.delete("/deleteAllUser",verification,deleteAllUsers)
userRoute.get("/searchUser",verification,searchUsers)
userRoute.post("/blockUnblockUser",verification,blockUnblockUser)
userRoute.get("/getAllDeletedUsers",verification,getAllDeleteUsers)
userRoute.post("/restoreUser",verification,restoreUser)
userRoute.post("/createSubscription",verification,createSubscription)
userRoute.get("/getAllSubscribedUser",verification,getAllSubscribedUser)
userRoute.get("/getDashboardStats",verification,getAdminDashboardStats)
userRoute.get("/getUserStats/:user_id",verification,getUserStats)
userRoute.post("/sendWellcomeEmail",verification,sendWellcomeEmail)
userRoute.get("/getAllDataOfDeletedUser/:user_id",verification,getAllDataOfDeletedUser)
userRoute.post("/sendSubscriptionEmail",verification,sendSubsciptionEmail)
userRoute.post("/cancelSubsciptionEmail",verification,cancelSubsciptionEmail)
userRoute.post("/unsubscribeUser",verification,cancelSubscription)
export default userRoute;
