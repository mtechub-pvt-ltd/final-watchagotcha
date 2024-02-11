import { Router } from 'express';
import { verification } from '../Middleware/Verification.js';
import {upload} from '../utils/ImageHandler.js'
import { createBanner, deleteAllBanner,  getAllBannersByStatus, getAllBannersByUser, getSpecificBanner, searchBanner, updateBanner, updateBannerStatus } from '../Controllers/bannerController.js';
import { addfavourite, createMassApp, getAllAppByCategory, getAllFavouritesApp, removeMassApp, removefavourite, searchApps } from '../Controllers/massAppController.js';
const massAppRoute = Router();

massAppRoute.post('/createMassApp',
verification,
// upload("massAppImages").single("icon"), 
createMassApp);
massAppRoute.delete('/removeMassApp/:id',verification, removeMassApp);
massAppRoute.post('/dragApp',verification, addfavourite);
massAppRoute.post('/removefavourite',verification, removefavourite);
massAppRoute.get("/getAllAppByCategory/:id",verification,getAllAppByCategory)
massAppRoute.get("/getAllAppsBycategory/:id",verification,getAllFavouritesApp)
massAppRoute.get("/searchApps",verification,searchApps)

export default massAppRoute;
