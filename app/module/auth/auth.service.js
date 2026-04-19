import express from "express"
import { User } from "./auth.model.js"
import * as jwtUtils from "../../common/utils/jwt.utils.js"
import ApiError from "../../common/utils/api-error.js"
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, generateResetToken } from "../../common/utils/jwt.utils.js"
import { sendVerificationEmail } from "../../common/config/email.js"
import crypto from "crypto"

const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex")
}

const registerUser = async ({ email, password, name, role }) => {
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            throw ApiError.conflict("Email already in use")
        }
        const { rawToken, hashedToken } = jwtUtils.generateResetToken()
        const user = await User.create({ email, password, name, role, verificationToken: hashedToken })

        try {
            await sendVerificationEmail(email, rawToken)
        } catch (error) {
            console.error("Error sending verification email", error)
            // Don't throw - user is registered, email failure is logged
        }

        const userObject = user.toObject()
        delete userObject.password
        delete userObject.verificationToken
        return userObject

    } catch (error) {
        console.error("Error in register service", error)
        throw error
    }
}

const verifyEmail = async (token) => {
    try {
        const hashedToken = hashToken(token)
        const user = await User.findOne({ verificationToken: hashedToken }).select("+verificationToken")    
        if (!user) {
            throw new ApiError.unauthorized("Invalid or expired token")
        }
        user.isVerified = true
        user.verificationToken = undefined
        await user.save()
        return { message: "Email verified successfully" }
    } catch (error) {
        console.error("Error in email verification", error)
        throw error
    }
}


const loginUser = async ({ email, password }) => {
    try {
        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            throw  ApiError.unauthorized("user not found")
        }
        if (!user.isVerified) {
            throw  ApiError.unauthorized("email not verified")
        }
        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            throw  ApiError.unauthorized("invalid credentials")
        }
        const payload = { id: user._id, email: user.email, role: user.role }
        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)
        user.refreshToken = hashToken(refreshToken)
        await user.save()
        return { accessToken, refreshToken }
    } catch (error) {
        console.error("Error in login service", error)
        throw error
    }
}


export {
    registerUser,
    loginUser,
    verifyEmail
}