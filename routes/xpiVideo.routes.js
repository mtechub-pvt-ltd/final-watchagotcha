import { Router } from "express";
import { verification } from "../Middleware/Verification.js";
import { uploadVideoWithLengthCheck } from "../utils/VideoHandler.js";
import {
    UnlikeVideo,
  createTopVideo,
  createXpiVideo,
  deleteAllVideos,
  deleteVideo,
  getAllCommentsByVideo,
  getAllLikesByVideo,
  getAllRecentVideosByCategory,
  getAllTrendingVideosByCategory,
  getAllVideos,
  getAllVideosByCategory,
  getAllVideosByUser,
  getComentedVideos,
  getMostViewedVideosByCategory,
  getSpecificVideo,
  getTopVideo,
  likeUnlikeVideo,
  likeVideo,
  searchVideos,
  sendComment,
  updateXpiVideo,
  uploadFile,
  viewVideo,
} from "../Controllers/xpiVideoController.js";
import { genericUploadFile, postLetterMedia } from "../utils/ImageHandler.js";
const xpiRoute = Router();

xpiRoute.post(
  "/createXpiVideo",
  verification,
  // uploadVideoWithLengthCheck("xpiVideos"),
  createXpiVideo
);
xpiRoute.post(
  "/fileUpload",
  verification,
  genericUploadFile("fileUpload").array('file'),
  uploadFile
);
xpiRoute.delete("/deleteXpiVideo/:id", verification, deleteVideo);
xpiRoute.put(
  "/updateXpiVideo",
  verification,
  // uploadVideoWithLengthCheck("xpiVideos"),
  updateXpiVideo
);


xpiRoute.get("/getAllVideos", verification, getAllVideos);
xpiRoute.get("/getAllRecentVideosByCategory/:id", verification, getAllRecentVideosByCategory);
xpiRoute.get("/getAllVideosByUser/:id", verification, getAllVideosByUser);
xpiRoute.get("/getAllVideosBycategory/:id", verification, getAllVideosByCategory);
xpiRoute.get("/getSpecificVideo/:id", verification, getSpecificVideo);
xpiRoute.delete("/deleteAllVideos", verification, deleteAllVideos);
//comment......................................
xpiRoute.post("/sendComment", verification, sendComment);
xpiRoute.get("/getAllCommentsByVideo/:id", verification, getAllCommentsByVideo);
///like...................................................
xpiRoute.post("/likeUnlikeVideo", verification, likeUnlikeVideo);
xpiRoute.post("/likeVideo", verification, likeVideo);
xpiRoute.post("/UnlikeVideo", verification, UnlikeVideo);
xpiRoute.get("/getAllLikesByVideo/:id", verification, getAllLikesByVideo);

// viewed mechanism...................................................
xpiRoute.post("/viewVideo", verification, viewVideo);
xpiRoute.get("/getMostViewedVideosByCategory/:id", verification, getMostViewedVideosByCategory);
xpiRoute.get("/getMostCommentedVideosByCategory/:id", verification, getComentedVideos);
xpiRoute.get("/getTrendingVideosByCategory/:id", verification, getAllTrendingVideosByCategory);

xpiRoute.get("/searchVideo", verification, searchVideos);

xpiRoute.post("/createTopVideo", verification, createTopVideo);
xpiRoute.get("/getTopVideo", verification, getTopVideo);
export default xpiRoute;
