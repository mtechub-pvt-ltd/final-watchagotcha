import { Router } from "express";
import { verification } from "../Middleware/Verification.js";
import { upload } from "../utils/ImageHandler.js";
import { UnlikePicTour, createPicTour, deleteAllPicTours, deletePicTour, getAllCommentsByPicTours, getAllLikesByPicTour, getAllPicTour, getAllPicTourByCategory, getAllPicToursByUser, getAllRecentToursByCategory, getAllTrendingToursByCategory, getComentedTours, getMostViewedToursByCategory, getSpecificPicTour, likePicTour, likeUnlikePicTour, searchTour, sendComment, updatePicTour, viewTour } from "../Controllers/picTourController.js";
import { changePaidStatus, createItem, deleteAllItems, deleteitem, getAllItemByCatgory, getAllItems, getAllItemsByPaid, getAllItemsByUser, getAllOfferByItem, getAllSavedItemsByUser, getOffer, getSpecificItem, saveItem, searchSaveItems, searchitems, sendOffer, unSaveItem, updateItem, updateOfferStatus } from "../Controllers/itemController.js";
const itemRoute = Router();

itemRoute.post(
  "/sellItem",
  verification,
  // verification,upload("itemImages",'item').array("images"),
  createItem
);
itemRoute.delete("/deleteitem/:id", verification, deleteitem);
itemRoute.delete("/deleteAllItems", verification, deleteAllItems);
itemRoute.put(
  "/updateItem",
  verification,
  verification,upload("itemImages").array("images"),
  updateItem
);
itemRoute.get("/getSpecificItem/:id", verification, getSpecificItem);
itemRoute.get("/getAllItemByCategory/:id", verification, getAllItemByCatgory);
itemRoute.get("/getAllItemByUser/:id", verification, getAllItemsByUser);
itemRoute.get("/getAllItems", verification, getAllItems);
itemRoute.get("/getAllItemsByPaidStatus", verification, getAllItemsByPaid);
itemRoute.get("/searchItems", verification, searchitems);

itemRoute.post("/sendOffer", verification, sendOffer);
itemRoute.post("/updateOfferStatus", verification, updateOfferStatus);
itemRoute.get("/getOffer/:id", verification, getOffer);
itemRoute.get("/getALlOfferByItem/:id", verification, getAllOfferByItem);

itemRoute.post("/saveItem", verification, saveItem);
itemRoute.post("/unSaveItem", verification, unSaveItem);
itemRoute.get("/getAllSavedItemsByUser/:id", verification, getAllSavedItemsByUser);
itemRoute.get("/searchSavedItems/:id", verification, searchSaveItems);

itemRoute.post("/changePaidStatus", verification, changePaidStatus);
export default itemRoute;
