import { Router } from "express";
import {
  createGEBCTop,
  createNewsTop,
  createQafiTop,
  createTopVideo,
  createTourTop,
  deleteAllGEBC,
  deleteAllNEWS,
  deleteAllQAFI,
  deleteAllTopItem,
  deleteAllTopLetter,
  deleteAllTopTours,
  deleteAllTopVideos,
  deleteTopGEBC,
  deleteTopNews,
  deleteTopQAFI,
  deleteTopTour,
  deleteTopVideo,
  getAllGEBC,
  getAllNews,
  getAllQAFI,
  getAllSpecificVideos,
  getAllTopGEBC,
  getAllTopItem,
  getAllTopLetter,
  getAllTopNews,
  getAllTopQAFI,
  getAllTopTour,
  getAllTopVideos,
  getAllTour,
  getAllVideos,
  getSpecificTopGEBC,
  getSpecificTopItem,
  getSpecificTopLetter,
  getSpecificTopNews,
  getSpecificTopQAFI,
  getSpecificTopTour,
  getTopGEBCApp,
  getTopItemApp,
  getTopLetterApp,
  getTopNewsApp,
  getTopQAFIApp,
  getTopTourApp,
  getTopVideoApp,
  setTopItem,
  setTopLetter,
  updateTopGEBC,
  updateTopNews,
  updateTopQAFI,
  updateTopTour,
  updateTopVideo,
} from "../Controllers/topController.js";
import { verification } from "../Middleware/Verification.js";
import { uploadVideoWithLengthCheck } from "../utils/VideoHandler.js";
import { upload } from "../utils/ImageHandler.js";
const topRoute = Router();
topRoute.post(
  "/createTopVideo",
  verification,
  uploadVideoWithLengthCheck("topVideos"),
  createTopVideo
);
topRoute.delete("/deleteTopVideo/:id", verification, deleteTopVideo);
topRoute.delete("/deleteAllTopVideo", verification, deleteAllTopVideos);
topRoute.put(
  "/updateTopVideo",
  verification,
  uploadVideoWithLengthCheck("topVideos"),
  updateTopVideo
);

topRoute.get("/getAllTopVideosByCategory/:id", verification, getAllTopVideos);
topRoute.get("/getAllTopVideos", verification, getAllVideos);
topRoute.get("/app/top_video/:id", verification, getTopVideoApp);
topRoute.get("/getSpecificTopVideo/:id", verification, getAllSpecificVideos);
//QAFI routes.........................................
topRoute.post(
  "/createTopQAFI",
  verification,
  verification,upload("topQAFI").single("image"),
  createQafiTop
);

topRoute.put(
  "/updateTopQAFI",
  verification,
  verification,upload("topQAFI").single("image"),
  updateTopQAFI
);
topRoute.delete("/deleteTopQAFI/:id", verification, deleteTopQAFI);
topRoute.delete("/deleteAllTopQAFI", verification, deleteAllQAFI);
topRoute.get("/getAllTopQAFIByCategory/:id", verification, getAllTopQAFI);
topRoute.get("/getAllTopQAFI", verification, getAllQAFI);
topRoute.get("/getSpecificTopQAFIsByCategory/:id", verification, getSpecificTopQAFI);
topRoute.get("/app/top_QAFI/:id", verification, getTopQAFIApp);

//GEBC routes.........................................
topRoute.post(
  "/createTopGEBC",
  verification,
  verification,upload("topGEBC").single("image"),
  createGEBCTop
);

topRoute.put(
  "/updateTopGEBC",
  verification,
  verification,upload("topGEBC").single("image"),
  updateTopGEBC
);
topRoute.delete("/deleteTopGEBC/:id", verification, deleteTopGEBC);
topRoute.delete("/deleteAllTopGEBC", verification, deleteAllGEBC);
topRoute.get("/getAllTopGEBCByCategory/:id", verification, getAllTopGEBC);
topRoute.get("/getAllTopGEBC", verification, getAllGEBC);
topRoute.get("/getSpecificTopGEBCsByCategory/:id", verification, getSpecificTopGEBC);
topRoute.get("/app/top_GEBC/:id", verification, getTopGEBCApp);


//NEWS routes.........................................
topRoute.post(
  "/createNewsTop",
  verification,
  verification,upload("topNEWS").single("image"),
  createNewsTop
);

topRoute.put(
  "/updateTopNews",
  verification,
  verification,upload("topNEWS").single("image"),
  updateTopNews
);
topRoute.delete("/deleteTopNEWS/:id", verification, deleteTopNews);
topRoute.delete("/deleteAllTopNEWS", verification, deleteAllNEWS);
topRoute.get("/getAllTopNEWSByCategory/:id", verification, getAllTopNews);
topRoute.get("/getAllTopNEWS", verification, getAllNews);
topRoute.get("/getSpecificTopNEWSByCategory/:id", verification, getSpecificTopNews);
topRoute.get("/app/top_News/:id", verification, getTopNewsApp);


//Top TOur routes.........................................
topRoute.post(
  "/createTourTop",
  verification,
  verification,upload("topTours").single("image"),
  createTourTop
);

topRoute.put(
  "/updateTopTour",
  verification,
  verification,upload("topTours").single("image"),
  updateTopTour
);
topRoute.delete("/deleteTopTour/:id", verification, deleteTopTour);
topRoute.delete("/deleteAllTopTour", verification, deleteAllTopTours);
topRoute.get("/getAllTopTourByCategory/:id", verification, getAllTopTour);
topRoute.get("/getAllTopTour", verification, getAllTour);
topRoute.get("/getSpecificTopTourByCategory/:id", verification, getSpecificTopTour);
topRoute.get("/app/top_tour/:id", verification, getTopTourApp);



//Top Market Zone routes.........................................
topRoute.post(
  "/setTopItem",
  verification,
  setTopItem
);
topRoute.get("/getSpecificTopItem/:id", verification, getSpecificTopItem);
topRoute.get("/getAllTopItem", verification, getAllTopItem);
topRoute.delete("/deleteAllTopItems", verification, deleteAllTopItem);
topRoute.get("/app/top_item", verification, getTopItemApp);


//Top post letter routes.........................................
topRoute.post(
  "/setTopLetter",
  verification,
  setTopLetter
);
topRoute.get("/getSpecificTopLetter/:id", verification, getSpecificTopLetter);
topRoute.get("/getAllTopLetter", verification, getAllTopLetter);
topRoute.delete("/deleteAllTopLetter", verification, deleteAllTopLetter);
topRoute.get("/app/top_letter", verification, getTopLetterApp);
export default topRoute;
