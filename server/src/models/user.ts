import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  role:string;
  bookmarks: string[]; // Array of contest IDs
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: 
    { type: String, default: "user" },
    bookmarks: [
      {
        type: String, // Store contest IDs as strings
      }
    ],
    
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
