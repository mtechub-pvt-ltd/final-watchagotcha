import { Router } from 'express';
import { verification } from '../Middleware/Verification.js';
import { create, deleteAllCategory, deleteCategory, getAllCategories, getSpecificCategory, searchCategories, updateCatgory } from '../Controllers/discCategoryController.js';
const discCategoryRoute = Router();

discCategoryRoute.post('/createDiscCategory',verification, create);
discCategoryRoute.delete('/deleteDiscCategory/:id',verification, deleteCategory);
discCategoryRoute.put('/updateDiscCategory',verification, updateCatgory);
discCategoryRoute.get("/getAllDiscCategories",verification,getAllCategories)
discCategoryRoute.get("/getSpecificDiscCategory/:id",verification,getSpecificCategory)
discCategoryRoute.delete("/deleteAllDiscCategories",verification,deleteAllCategory)
discCategoryRoute.get("/searchDiscCategories",verification,searchCategories)
export default discCategoryRoute;
