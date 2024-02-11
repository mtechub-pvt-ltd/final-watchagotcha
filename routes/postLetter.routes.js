import { Router } from 'express';
import { verification } from '../Middleware/Verification.js';
import {postLetterMedia, upload} from '../utils/ImageHandler.js'
import { createSignature, deleteAllSignature, deleteSignature, getAllSignature, getAllSignatureByUserId, getSpecificSignature, updateSignature } from '../Controllers/signatureController.js';
import { createPostLetter, deleteLetter, getAllLetter, getAllLetterByDiscCategory, getAllLetterByPostType, getAllLetterByUser, getAllLetterPrivate, getAllLetterPrivateOther, getAllLetterPublicGeneral, getAllLetterPublicOther, getAllRecievedLetter, getSpecificLetter, searchLetters, updatePostLetter, updatePostLetterImages } from '../Controllers/postLetterController.js';
const postLetterRoute = Router();

postLetterRoute.post('/createLetter',verification,postLetterMedia("letterMedia").array("media"), createPostLetter);
postLetterRoute.delete('/deleteLetter/:id',verification, deleteLetter);
postLetterRoute.put('/updatePostLetter',verification, updatePostLetter);
postLetterRoute.put('/updatePostLetterImages',verification,postLetterMedia("letterMedia").array("media"), updatePostLetterImages);
postLetterRoute.get("/getAllLetter",verification,getAllLetter)
postLetterRoute.get("/getAllLetterByUser/:id",verification,getAllLetterByUser)
postLetterRoute.get("/getAllLetterByPostType/:id",verification,getAllLetterByPostType)
postLetterRoute.get("/getAllLetterByDiscCategory/:id",verification,getAllLetterByDiscCategory)

postLetterRoute.get("/public_general_by_category/:id",verification,getAllLetterPublicGeneral)
postLetterRoute.get("/public_celebrity_by_category/:id",verification,getAllLetterPublicOther)
postLetterRoute.get("/private_friends_by_category/:id",verification,getAllLetterPrivate)
postLetterRoute.get("/private_celebrity_by_category/:id",verification,getAllLetterPrivateOther)
postLetterRoute.get("/getSpecificLetter/:id",verification,getSpecificLetter)
postLetterRoute.get("/searchLetters",verification,searchLetters)
postLetterRoute.delete("/deleteAllSignature",verification,deleteAllSignature)
postLetterRoute.get("/getAllRecievedLetterByUser/:id",verification,getAllRecievedLetter)
export default postLetterRoute;
