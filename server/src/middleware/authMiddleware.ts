import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
const JWT_SECRET = process.env.JWT_SECRET||'asdfghjmikkhjasknsdh'; // Store securely in .env


interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

// Extend the Request type to include the user object
interface AuthRequest extends Request {
  user?: { _id: string }; // Ensure `user` exists and has an `_id`
  userId?: string; // Add userId property to AuthRequest
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided." });
    return; // Ensure the function stops execution
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as { userId: string };
    req.userId = decoded.userId;
    next(); // Move to the next middleware
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token." });
    return; // Stop execution to prevent calling next()
  }
};
export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  console.log("🔹 protect middleware triggered");

  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("🔹 Token received:", token);

      // Verify JWT and get decoded token
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as unknown as DecodedToken;
      console.log("🔹 Verifying Token with Secret:", process.env.JWT_SECRET);
      console.log("🔹 Decoded token:", decoded);

      // Find user by ID but exclude the password
      const user = await User.findById(decoded.userId).select("-password");


      if (!user) {
        console.log("❌ No user found");
        res.status(401).json({ message: "Not authorized, no user found" });
        return;
      }

      // Assign user to req.user with type safety
      req.user = { _id: (user._id as string).toString() };

      console.log("🔹 User found:", req.user);
      next();
    } catch (error) {
      console.error("❌ Token verification error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log("❌ No token provided");
    res.status(401).json({ message: "Not authorized, no token" });
  }
};


export default authMiddleware;
