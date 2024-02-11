import { Router } from 'express';
import { verification } from '../Middleware/Verification.js';
import { createShareApp, deleteShareApp, getAlllinks, getSpecificLink, updateLink } from '../Controllers/shareAppController.js';
const shareAppRoute = Router();

shareAppRoute.post('/addLink',verification, createShareApp);
shareAppRoute.delete('/deleteLink/:id',verification, deleteShareApp);
shareAppRoute.put('/updateLink',verification, updateLink);
shareAppRoute.get("/getAlllinks",verification,getAlllinks)
shareAppRoute.get("/getSpecificLink/:id",verification,getSpecificLink)
export default shareAppRoute;
