import { Router } from 'express';
import { verification } from '../Middleware/Verification.js';
import { create, deleteAllCategory, deleteCategory, getAllCategories, getSpecificCategory, searchCategories, updateCatgory } from '../Controllers/discCategoryController.js';
import { createConfig, deleteConfig, getAllBannerConfig, getSpecificConfig, updateConfig } from '../Controllers/bannerConfigController.js';
const bannerConfigRoute = Router();

bannerConfigRoute.post('/createBannerConfiguartion',verification, createConfig);
bannerConfigRoute.delete('/deleteBannerConfig/:id',verification, deleteConfig);
bannerConfigRoute.put('/updateBannerConfig',verification, updateConfig);
bannerConfigRoute.get("/getSpecificBannerConfig/:id",verification,getSpecificConfig)
bannerConfigRoute.get('/getAllBannerConfig',verification, getAllBannerConfig);
export default bannerConfigRoute;
