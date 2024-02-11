import { Router } from 'express';
import { verification } from '../Middleware/Verification.js';
import {upload} from '../utils/ImageHandler.js'
import { createSignature, deleteAllSignature, deleteSignature, getAllSignature, getAllSignatureByUserId, getSpecificSignature, updateSignature } from '../Controllers/signatureController.js';
const signatureRoute = Router();

signatureRoute.post('/createSignature',verification,upload("signatureImages").single("image"), createSignature);
signatureRoute.delete('/deleteSignature/:id',verification, deleteSignature);
signatureRoute.put('/updateSignature',verification,upload("signatureImages").single("image"), updateSignature);
signatureRoute.get("/getAllSignatures",verification,getAllSignature)
signatureRoute.get("/getAllSignaturesByUserId/:id",verification,getAllSignatureByUserId)
signatureRoute.get("/getSpecificSignature/:id",verification,getSpecificSignature)
signatureRoute.delete("/deleteAllSignature",verification,deleteAllSignature)
export default signatureRoute;
