import express from "express";
import { signup, login,logout,getBookmarkedContests,addBookmark, removeBookmark } from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authMiddleware,logout);
router.get("/bookmarks", authMiddleware, getBookmarkedContests);
router.post("/bookmarks", authMiddleware, addBookmark);
router.delete("/bookmarks", authMiddleware, removeBookmark);

export default router;