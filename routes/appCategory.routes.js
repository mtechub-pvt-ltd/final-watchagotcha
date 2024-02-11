import { Router } from 'express';
import { create, deleteAllCategory, deleteCategory, getAllCategories, getSpecificCategory, searchCategories, updateCatgory } from '../Controllers/appCategoryController.js';
import { verification } from '../Middleware/Verification.js';
const appCategoryRoute = Router();

appCategoryRoute.post('/createAppCategory',verification, create);
appCategoryRoute.delete('/deleteAppCategory/:id',verification, deleteCategory);
appCategoryRoute.put('/updateAppCategory',verification, updateCatgory);
appCategoryRoute.get("/getAllAppCategories",verification,getAllCategories)
appCategoryRoute.get("/getSpecificAppCategory/:id",verification,getSpecificCategory)
appCategoryRoute.delete("/deleteAllAppCategories",verification,deleteAllCategory)
appCategoryRoute.get("/searchAppCategories",verification,searchCategories)
export default appCategoryRoute;
