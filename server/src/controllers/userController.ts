import { Request, Response, NextFunction, RequestHandler } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
const JWT_SECRET = process.env.JWT_SECRET ||'asdfghjmikkhjasknsdh'; // Store securely in .env
interface AuthRequest extends Request {
  user?: { _id: string }; // Ensure `_id` is of type string
}
// Signup
export const signup: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    const newUser = new User({ email, password });
    await newUser.save();

    // 🔹 Log the stored user to check if password is hashed
    console.log("Stored User:", await User.findOne({ email }));

    res.status(201).json({ message: "User registered successfully." });
    return;
  } catch (error) {
    next(error);
  }
};


// Login
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || ''; 


export const login: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if the provided email matches the admin email
    if (email === ADMIN_EMAIL) {
      const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
      if (!isMatch) {
        res.status(400).json({ message: "Invalid email or password." });
        return; // End the request cycle after sending the response
      }

      // If admin credentials match, send admin token and data
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }
      const token = jwt.sign({ userId: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: '7d' });
      console.log("🔹 Signing Token with Secret:", process.env.JWT_SECRET);
      res.json({
        token,
        user: { id: ADMIN_EMAIL, email: ADMIN_EMAIL, role: 'admin' }, // Send admin details
      });
      return; // End the request cycle after sending the response
    }

    // Regular user login flow
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password." });
      return; // End the request cycle after sending the response
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password." });
      return; // End the request cycle after sending the response
    }

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, email: user.email, bookmarks: user.bookmarks },
    });
    return; // End the request cycle after sending the response
  } catch (error) {
    next(error); // Passes the error to Express error handler
  }
};

export const logout = (req: Request, res: Response): void => {
  // Clear JWT token or destroy session
  res.clearCookie('authToken', { httpOnly: true });

  // Send a response indicating successful logout
  res.status(200).json({ message: 'Successfully logged out' });
};
export const getBookmarkedContests: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const user = await User.findById((req as any).userId).select("bookmarks");
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.json({ bookmarks: user.bookmarks });
  } catch (error) {
    next(error);
  }
};

// Add a Bookmark
export const addBookmark: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { contestId } = req.body as { contestId: string };

    const user = await User.findById((req as any).userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    if (!user.bookmarks.includes(contestId)) {
      user.bookmarks.push(contestId);
      await user.save();
    }

    res.json({ message: "Contest bookmarked.", bookmarks: user.bookmarks });
  } catch (error) {
    next(error);
  }
};


// Remove a Bookmark
export const removeBookmark = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { contestId } = req.body;

    const user = await User.findById((req as any).userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return; // Ensure void return
    }

    user.bookmarks = user.bookmarks.filter((id) => id.toString() !== contestId);
    await user.save();

    res.json({ message: "Bookmark removed.", bookmarks: user.bookmarks });
    return; // Explicitly return to satisfy TypeScript
  } catch (error) {
    next(error);
  }
};


export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({ message: "Not authorized, no user found" });
      return;
    }

    const user = await User.findById(req.user._id).select("-password"); // Exclude password

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
    console.log("User profile sent:", user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};