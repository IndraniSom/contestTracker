import express from "express";
import { getAllUsers,totalUsers } from "../controllers/adminController";
import   checkadmin  from "../middleware/authMiddleware";

const router = express.Router();

router.get("/getuser", checkadmin, getAllUsers); 
router.get("/total-users", checkadmin, totalUsers);


export default router;