import { Router } from 'express';
import { verification } from '../Middleware/Verification.js';
import { create, deleteAllCategory, deleteCategory, getAllCategories, getSpecificCategory, searchCategories, updateCatgory } from '../Controllers/itemCategoryController.js';
const itemCategoryRoute = Router();

itemCategoryRoute.post('/createItemCategory',verification, create);
itemCategoryRoute.delete('/deleteItemCategory/:id',verification, deleteCategory);
itemCategoryRoute.put('/updateItemCategory',verification, updateCatgory);
itemCategoryRoute.get("/getAllItemCategories",verification,getAllCategories)
itemCategoryRoute.get("/getSpecificItemCategory/:id",verification,getSpecificCategory)
itemCategoryRoute.delete("/deleteAllItemCategories",verification,deleteAllCategory)
itemCategoryRoute.get("/searchItemCategories",verification,searchCategories)
export default itemCategoryRoute;
