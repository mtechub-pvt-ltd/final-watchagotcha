import { Router } from 'express';
import { verification } from '../Middleware/Verification.js';
import { create, deleteAllCategory, deleteCategory, getAllCategories, getSpecificCategory, searchCategories, updateCatgory } from '../Controllers/discCategoryController.js';
import { createConfig, deleteConfig, getSpecificConfig, updateConfig } from '../Controllers/bannerConfigController.js';
import { createContactUs, deleteMessage, getAllMessages, getSpecificMessage, updateMessage, updateMessageStatus } from '../Controllers/contactUsController.js';
const contactUsRoute = Router();

contactUsRoute.post('/createMessage',verification, createContactUs);
contactUsRoute.delete('/deleteMessage/:id',verification, deleteMessage);
contactUsRoute.put('/updateMessage',verification, updateMessage);
contactUsRoute.get("/getSpecificMessage/:id",verification,getSpecificMessage)
contactUsRoute.get("/getAllMessages",verification,getAllMessages)
contactUsRoute.put('/updateMessageStatus',verification, updateMessageStatus);
export default contactUsRoute;
