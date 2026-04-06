import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        minlength: 2,
        maxlength: 40,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: [true, "email is required"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: ["true", "password is required"],
        minlength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ["admin", "customer","seller"],
        default: "customer"
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: { type: String, select: false },
    refreshToken: { type: String, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: String, select: false }

}, { timestamps: true })

export default mongoose.model("User", userSchema)