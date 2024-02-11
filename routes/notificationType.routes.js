import { Router } from 'express';
import { verification } from '../Middleware/Verification.js';
import { createType, deleteAllType, deleteType, getAllTypes, getSpecificType, updateType } from '../Controllers/notificationTypeController.js';
const notificationType = Router();

notificationType.post('/createType',verification, createType);
notificationType.delete('/deleteType/:id',verification, deleteType);
notificationType.put('/updateType',verification, updateType);
notificationType.get("/getAllTypes",verification,getAllTypes)
notificationType.get("/getSpecificType/:id",verification,getSpecificType)
notificationType.delete("/deleteAllType",verification,deleteAllType)
export default notificationType;
