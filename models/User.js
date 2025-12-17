import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Counter from "./Counter.js";

const userSchema = new mongoose.Schema(
  {
    userId: { type: Number, unique: true },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    idNumber: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "student"],
      default: "student",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Auto increment userId
userSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  const counter = await Counter.findOneAndUpdate(
    { name: "userId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.userId = counter.seq;
  next();
});

// Password hash
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model("User", userSchema);
