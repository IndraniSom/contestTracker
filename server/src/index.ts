import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userroute";


dotenv.config(); // Load environment variables

const app: Application = express();


app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://contest-tracker-2r35.vercel.app", // Allow frontend URL
    credentials: true, // Allow cookies, tokens, etc.
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  })
);

app.use(express.json());


app.use("/users", userRoutes);


const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI is not defined in .env file");

    await mongoose.connect(mongoUri);
    console.log(" MongoDB Connected");
  } catch (error) {
    console.error(" MongoDB Connection Error:", (error as Error).message);
    process.exit(1); // Exit if connection fails
  }
};

// ✅ Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(" Error:", err.message);
  res.status(500).json({ success: false, message: err.message });
});


const PORT: number = Number(process.env.PORT) || 5000;
app.listen(PORT, async () => {
  await connectDB(); 
  console.log(` Server running on port ${PORT}`);
});
