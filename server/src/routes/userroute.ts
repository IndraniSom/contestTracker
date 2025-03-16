import express from "express";
import { signup, login,logout,getBookmarkedContests,addBookmark, removeBookmark,getUserProfile } from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";
import {protect} from "../middleware/authMiddleware";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authMiddleware,logout);
router.get("/bookmarks", authMiddleware, getBookmarkedContests);
router.post("/bookmarks", authMiddleware, addBookmark);
router.delete("/bookmarks", authMiddleware, removeBookmark);
router.get("/me", (req, res, next) => {
    console.log("🔹 /me route hit"); // Check if request reaches here
    next();
}, protect, getUserProfile);
export default router;