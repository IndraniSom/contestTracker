import { Request, Response, NextFunction, RequestHandler } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await User.find().select("-password"); // Exclude password for security
  
      res.json({ totalUsers: users.length, users });
    } catch (error) {
      next(error);
    }
  };
export const totalUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const count = await User.countDocuments();
      res.json({ totalUsers: count });
    } catch (error) {
      next(error);
    }
  };
    