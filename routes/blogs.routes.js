import { Router } from 'express';
import { verification } from '../Middleware/Verification.js';
import {upload} from '../utils/ImageHandler.js'
import { createBlog, deleteAllBlog, deleteBlog, getAllBlogs, getSpecificBlog, searchBlogs, updateBlog } from '../Controllers/blogController.js';
const blogRoute = Router();

blogRoute.post('/createBlog',verification,upload("blogImages").single("image"), createBlog);
blogRoute.delete('/deleteBlog/:id',verification, deleteBlog);
blogRoute.put('/updateBlog',verification,upload("blogImages").single("image"), updateBlog);
blogRoute.get("/getAllBlogs",verification,getAllBlogs)
blogRoute.get("/getSpecificBlog/:id",verification,getSpecificBlog)
blogRoute.delete("/deleteAllBlogs",verification,deleteAllBlog)
blogRoute.get("/searchBlogs",verification,searchBlogs)
export default blogRoute;
