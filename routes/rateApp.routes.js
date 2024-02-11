import { Router } from 'express';
import { verification } from '../Middleware/Verification.js';
import { create, deleteAllCategory, deleteCategory, getAllCategories, getSpecificCategory, searchCategories, updateCatgory } from '../Controllers/discCategoryController.js';
import { createRateApp, deleteRateApp, getAlllinks, getSpecificLink, updateLink } from '../Controllers/rateAppController.js';
const rateAppRoute = Router();

rateAppRoute.post('/addLink',verification, createRateApp);
rateAppRoute.delete('/deleteLink/:id',verification, deleteRateApp);
rateAppRoute.put('/updateLink',verification, updateLink);
rateAppRoute.get("/getAlllinks",verification,getAlllinks)
rateAppRoute.get("/getSpecificLink/:id",verification,getSpecificLink)
export default rateAppRoute;
