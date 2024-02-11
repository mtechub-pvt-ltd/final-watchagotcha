import { Router } from "express";
import { verification } from "../Middleware/Verification.js";
import { upload } from "../utils/ImageHandler.js";
import { UnlikePicTour} from "../Controllers/picTourController.js";
import {  getAllCommentsByGEBC, getAllGEBCByUser, getAllGEBCs, getAllGEBCsByCategory, getAllLikesByGBEC, getSpecificGEBC, likeUnlikeGEBC, searchGEBCs, updateGEBC } from "../Controllers/gebcController.js";
import { createNews, deleteAllNews, deleteNews, getAllCommentsByNews, getAllLikesByNews, getAllNews, getAllNewsByCategory, getAllNewsByUser, getSpecificNews, likeUnlikeNews, searchNews, sendComment, updateNews } from "../Controllers/newsController.js";
const newsRoute = Router();

newsRoute.post(
  "/createNews",
  verification,
  // verification,upload("newsImages").single("image"),
  createNews
);
newsRoute.delete("/deleteNews/:id", verification, deleteNews);
newsRoute.put(
  "/updateNews",
  verification,
  // verification,upload("newsImages").single("image"),
  updateNews
);
newsRoute.get("/getAllNews", verification, getAllNews);
newsRoute.get("/getAllNewsByUser/:id", verification, getAllNewsByUser);
newsRoute.get("/getAllNewsByCategory/:id", verification, getAllNewsByCategory);
newsRoute.get("/getSpecificNews/:id", verification, getSpecificNews);
newsRoute.delete("/deleteAllNews", verification, deleteAllNews);
//comment......................................
newsRoute.post("/sendComment", verification, sendComment);
newsRoute.get("/getAllCommentsByNews/:id", verification, getAllCommentsByNews);
///like...................................................
newsRoute.post("/likeUnlikeNews", verification, likeUnlikeNews);
newsRoute.post("/UnlikePicTour", verification, UnlikePicTour);
newsRoute.get("/getAllLikesByNews/:id", verification, getAllLikesByNews);


newsRoute.get("/searchNews", verification, searchNews);
export default newsRoute;
