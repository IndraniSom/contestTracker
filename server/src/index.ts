import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userroute"; // Import userRoutes
import adminRoutes from "./routes/adminroute"; // Import adminRoutes
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRoutes); // Use userRoutes
app.use("/admin", adminRoutes); // Use adminRoutes
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}

mongoose
  .connect(mongoUri, {})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));