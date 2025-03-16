import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Store securely in .env

// Extend Request type to include userId
interface AuthRequest extends Request {
  userId?: string;
}


const adminEmail = process.env.ADMIN_EMAIL; // Set the admin email in your .env
const adminPassword = process.env.ADMIN_PASSWORD; // Set the admin password in your .env

// Middleware to check if the admin is logged in
export const checkadmin = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
  
    console.log("Received email:", email); // Log the email
    console.log("Received password:", password); // Log the password
    console.log("Admin credentials:", adminEmail, adminPassword); // Log the stored admin credentials
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
  
    // Check if the email and password match the admin credentials
    if (email === adminEmail && password === adminPassword) {
      return next(); // Proceed to the next middleware/route handler
    }
  
    return res.status(401).json({ message: "Unauthorized. Admin credentials are incorrect." });
  };
  

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided." });
    return; // Ensure the function stops execution
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next(); // Move to the next middleware
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token." });
    return; // Stop execution to prevent calling next()
  }
};

export default authMiddleware;
