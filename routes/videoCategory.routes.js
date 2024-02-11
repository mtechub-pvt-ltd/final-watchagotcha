import { Router } from 'express';
import { verification } from '../Middleware/Verification.js';
import { create, deleteAllCategory, deleteCategory, getAllCategories, getSpecificCategory, searchCategories, updateCatgory } from '../Controllers/videoCategoryController.js';
const videoCategoryRoute = Router();

videoCategoryRoute.post('/createVideoCategory',verification, create);
videoCategoryRoute.delete('/deleteVideoCategory/:id',verification, deleteCategory);
videoCategoryRoute.put('/updateVideoCategory',verification, updateCatgory);
videoCategoryRoute.get("/getAllVideoCategories",verification,getAllCategories)
videoCategoryRoute.get("/getSpecificVideoCategory/:id",verification,getSpecificCategory)
videoCategoryRoute.delete("/deleteAllVideoCategories",verification,deleteAllCategory)
videoCategoryRoute.get("/searchVideoCategories",verification,searchCategories)
export default videoCategoryRoute;
