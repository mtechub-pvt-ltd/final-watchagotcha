import { Router } from "express";
import { verification } from "../Middleware/Verification.js";
import { upload } from "../utils/ImageHandler.js";
import { UnlikePicTour} from "../Controllers/picTourController.js";
import { createQafi, deleteAllQAFIs, deleteQafi, getAllCommentsByQAFI, getAllLikesByQafi, getAllQAFIs, getAllQafisByCategory, getAllQafisByUser, getSpecificQafi, likeUnlikeQafi, searchQafi, sendComment, updateQafi } from "../Controllers/qafiControler.js";
const qafiRoute = Router();

qafiRoute.post(
  "/createQafi",
  verification,
  verification,upload("qafiImages").single("image"),
  createQafi
);
qafiRoute.delete("/deleteQafi/:id", verification, deleteQafi);
qafiRoute.put(
  "/updateQafi",
  verification,
  verification,upload("qafiImages").single("image"),
  updateQafi
);
qafiRoute.get("/getAllQAFIs", verification, getAllQAFIs);
qafiRoute.get("/getAllQafisByUser/:id", verification, getAllQafisByUser);
qafiRoute.get("/getAllQafisByCategory/:id", verification, getAllQafisByCategory);
qafiRoute.get("/getSpecificQafi/:id", verification, getSpecificQafi);
qafiRoute.delete("/deleteAllQAFIs", verification, deleteAllQAFIs);
//comment......................................
qafiRoute.post("/sendComment", verification, sendComment);
qafiRoute.get("/getAllCommentsByQAFI/:id", verification, getAllCommentsByQAFI);
///like...................................................
qafiRoute.post("/likeUnlikeQafi", verification, likeUnlikeQafi);
qafiRoute.post("/UnlikePicTour", verification, UnlikePicTour);
qafiRoute.get("/getAllLikesByQafi/:id", verification, getAllLikesByQafi);


qafiRoute.get("/searchQafi", verification, searchQafi);
export default qafiRoute;
