import express from "express";
const router = express.Router();
import asyncHandler from "../middleware/asyncHandler.js";
import products from "../data/products.js";
import Product from "../models/productModel.js";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  getUserbyID,
  getUsers,
  deleteUser,
  updateUserProfile,
  updateUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleWare.js";

router.route("/").post(registerUser).get(getUsers);
router.post("/logout", logoutUser);
router.post("/login", authUser);
router
  .route("/profile")
  //user needs to be registered, therefore protected
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route("/:id").delete(admin, deleteUser).get(admin, getUserbyID).put(updateUser);
export default router;
