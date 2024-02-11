import { Router } from "express";
import { verification } from "../Middleware/Verification.js";
import { upload } from "../utils/ImageHandler.js";
import { UnlikePicTour, createPicTour, deleteAllPicTours, deletePicTour, getAllCommentsByPicTours, getAllLikesByPicTour, getAllPicTour, getAllPicTourByCategory, getAllPicToursByUser, getAllRecentToursByCategory, getAllTrendingToursByCategory, getComentedTours, getMostViewedToursByCategory, getSpecificPicTour, likePicTour, likeUnlikePicTour, searchTour, sendComment, updatePicTour, viewTour } from "../Controllers/picTourController.js";
const picTourRoute = Router();

picTourRoute.post(
  "/createPicTour",
  verification,
  verification,upload("picTourImages").single("image"),
  createPicTour
);
picTourRoute.delete("/deletePicTour/:id", verification, deletePicTour);
picTourRoute.put(
  "/updatePicTour",
  verification,
  verification,upload("picTourImages").single("image"),
  updatePicTour
);
picTourRoute.get("/getAllPicTours", verification, getAllPicTour);
picTourRoute.get("/getAllPicToursByUser/:id", verification, getAllPicToursByUser);
picTourRoute.get("/getAllRecentVideosByCategory/:id", verification, getAllRecentToursByCategory);
picTourRoute.get("/getAllPicTourByCategory/:id", verification, getAllPicTourByCategory);
picTourRoute.get("/getSpecificPicTour/:id", verification, getSpecificPicTour);
picTourRoute.delete("/deleteAllPicTours", verification, deleteAllPicTours);
//comment......................................
picTourRoute.post("/sendComment", verification, sendComment);
picTourRoute.get("/getAllCommentsByPicTour/:id", verification, getAllCommentsByPicTours);
///like...................................................

picTourRoute.post("/likeUnlikePicTour", verification, likeUnlikePicTour);
picTourRoute.post("/likePicTour", verification, likePicTour);
picTourRoute.post("/UnlikePicTour", verification, UnlikePicTour);
picTourRoute.get("/getAllLikesByPicTour/:id", verification, getAllLikesByPicTour);

// viewed mechanism...................................................
picTourRoute.post("/viewTour", verification, viewTour);
picTourRoute.get("/getMostViewedToursByCategory/:id", verification, getMostViewedToursByCategory);
picTourRoute.get("/getMostCommentedToursByCategory/:id", verification, getComentedTours);
picTourRoute.get("/getAllTrendingToursByCategory/:id", verification, getAllTrendingToursByCategory);

picTourRoute.get("/searchTour", verification, searchTour);
export default picTourRoute;
