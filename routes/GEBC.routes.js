import { Router } from "express";
import { verification } from "../Middleware/Verification.js";
import { upload } from "../utils/ImageHandler.js";
import { UnlikePicTour} from "../Controllers/picTourController.js";
import { createGEBC, deleteAllGEBCs, deleteGEBC, getAllCommentsByGEBC, getAllGEBCByUser, getAllGEBCs, getAllGEBCsByCategory, getAllLikesByGBEC, getSpecificGEBC, likeUnlikeGEBC, searchGEBCs, sendComment, updateGEBC } from "../Controllers/gebcController.js";
const gebcRoute = Router();

gebcRoute.post(
  "/createGEBC",
  verification,
  // verification,upload("gebcImages").single("image"),
  createGEBC
);
gebcRoute.delete("/deleteGEBC/:id", verification, deleteGEBC);
gebcRoute.put(
  "/updateGEBC",
  verification,
  // verification,upload("gebcImages").single("image"),
  updateGEBC
);
gebcRoute.get("/getAllGEBCs", verification, getAllGEBCs);
gebcRoute.get("/getAllGEBCByUser/:id", verification, getAllGEBCByUser);
gebcRoute.get("/getAllGEBCsByCategory/:id", verification, getAllGEBCsByCategory);
gebcRoute.get("/getSpecificGEBC/:id", verification, getSpecificGEBC);
gebcRoute.delete("/deleteAllGEBCs", verification, deleteAllGEBCs);
//comment......................................
gebcRoute.post("/sendComment", verification, sendComment);
gebcRoute.get("/getAllCommentsByGEBC/:id", verification, getAllCommentsByGEBC);
///like...................................................
gebcRoute.post("/likeUnlikeGEBC", verification, likeUnlikeGEBC);
gebcRoute.post("/UnlikePicTour", verification, UnlikePicTour);
gebcRoute.get("/getAllLikesByGEBC/:id", verification, getAllLikesByGBEC);


gebcRoute.get("/searchGEBCs", verification, searchGEBCs);
export default gebcRoute;
