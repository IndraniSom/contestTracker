import mongoose from "mongoose";

const SolutionSchema = new mongoose.Schema({
  contestId: { type: String, required: true, unique: true }, // ID from public API
  youtubeSolution: { type: String, required: true }, // YouTube link
});

const Solution = mongoose.model("Solution", SolutionSchema);

export default Solution;
