import mongoose, { Document } from "mongoose";

type VideoKycStatus =
  | "not_required"
  | "pending"
  | "in_progress"
  | "approved"
  | "rejected";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "user" | "partner" | "admin";
  isEmailVerified?: boolean;
  otp?: string;
  otpExpiresAt?: Date;
  partnerOnBoardingSteps: number;
  mobileNumber?: string;
  partnerStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  videoKycStatus: VideoKycStatus;
  videoKycRoomId: string;
  videoKycRejectionReason: string;
  socketId: string | null;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
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
    },

    role: {
      type: String,
      default: "user",
      enum: ["user", "partner", "admin"],
    },

    partnerStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    partnerOnBoardingSteps: {
      type: Number,
      min: 0,
      max: 8,
      default: 0,
    },

    otp: {
      type: String,
    },

    mobileNumber: {
      type: String,
    },

    otpExpiresAt: {
      type: Date,
    },

    rejectionReason: {
      type: String,
    },

    videoKycStatus: {
      type: String,
      default: "not_required",
      enum: ["not_required", "pending", "in_progress", "approved", "rejected"],
    },

    videoKycRoomId: {
      type: String,
    },

    videoKycRejectionReason: {
      type: String,
    },

    socketId: {
      type: String,
      default: null,
    },

    isOnline: {
      type: Boolean,
      default: false,
      index: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: [Number],
    },
  },

  { timestamps: true },
);

userSchema.index({ location: "2dsphere" });
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
