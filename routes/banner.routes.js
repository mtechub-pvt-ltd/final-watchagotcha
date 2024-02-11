import { Router } from 'express';
import { verification } from '../Middleware/Verification.js';
import {upload} from '../utils/ImageHandler.js'
import { createBlog, deleteAllBlog, deleteBlog, getAllBlogs, getSpecificBlog, searchBlogs, updateBlog } from '../Controllers/blogController.js';
import { createBanner, deleteAllBanner, deletebanner, getAllBanners, getAllBannersByStatus, getAllBannersByUser, getSpecificBanner, searchBanner, updateBanner, updateBannerStatus } from '../Controllers/bannerController.js';
const bannerRoute = Router();

bannerRoute.post('/createBanner',verification, createBanner);
bannerRoute.delete('/deletebanner/:id',verification, deletebanner);
bannerRoute.put('/updateBanner',verification, updateBanner);
bannerRoute.get("/getAllBanners",verification,getAllBanners)
bannerRoute.get("/getAllBannersByUser/:id",verification,getAllBannersByUser)
bannerRoute.get("/getSpecificBanner/:id",verification,getSpecificBanner)
bannerRoute.delete("/deleteAllBanner",verification,deleteAllBanner)
bannerRoute.get("/searchBanner",verification,searchBanner)

bannerRoute.get("/getAllBannersByStatus",verification,getAllBannersByStatus)
bannerRoute.post("/updateBannerStatus",verification,updateBannerStatus)
export default bannerRoute;
