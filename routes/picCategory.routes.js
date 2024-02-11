import { Router } from 'express';
import { verification } from '../Middleware/Verification.js';
import { create, deleteAllCategory, deleteCategory, getAllCategories, getSpecificCategory, searchCategories, updateCatgory } from '../Controllers/picCategoryController.js';
const picCategoryRoute = Router();

picCategoryRoute.post('/createPicCategory',verification, create);
picCategoryRoute.delete('/deletePicCategory/:id',verification, deleteCategory);
picCategoryRoute.put('/updatePicCategory',verification, updateCatgory);
picCategoryRoute.get("/getAllPicCategories",verification,getAllCategories)
picCategoryRoute.get("/getSpecificPicCategory/:id",verification,getSpecificCategory)
picCategoryRoute.delete("/deleteAllPicCategories",verification,deleteAllCategory)
picCategoryRoute.get("/searchPicCategories",verification,searchCategories)
export default picCategoryRoute;
