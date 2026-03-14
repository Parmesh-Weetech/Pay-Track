import mongoose from "mongoose";
import { UserStatus } from "../types/user-status";

export const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    status: {
        type: String,
        enum: UserStatus,
        required: true
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});

UserSchema.index({ status: 1 });

export const User = mongoose.model("User", UserSchema);
