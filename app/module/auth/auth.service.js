import express from "express"
import { User } from "./auth.model.js"
import * as jwtUtils from "../../common/utils/jwt.utils.js"
import ApiError from "../../common/utils/api-error.js"
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, generateResetToken } from "../../common/utils/jwt.utils.js"
import { sendVerificationEmail,sendResetPasswordEmail } from "../../common/config/email.js"
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
            throw ApiError.unauthorized("Invalid or expired token")
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


const refresh = async (token) => {
    if (!token) throw ApiError.badRequest("Token not found")

    // 1. Verify the signature of the token
    let decoded;
    try {
        decoded = verifyRefreshToken(token)
    } catch (err) {
        throw ApiError.unauthorized("Invalid or expired refresh token")
    }

    // 2. Look up the user
    const user = await User.findById(decoded.id).select("+refreshToken")
    if (!user) throw ApiError.unauthorized("User not found")

    // 3. Compare the raw token with the hashed token in DB
    if (user.refreshToken !== hashToken(token)) throw ApiError.unauthorized("Invalid refresh token")

    // 4. Generate brand new tokens
    const accessToken = generateAccessToken({ id: user._id, email: user.email, role: user.role })
    const refreshToken = generateRefreshToken({ id: user._id, email: user.email, role: user.role })

    // 5. Hash and save the new refresh token
    user.refreshToken = hashToken(refreshToken)
    await user.save()

    // It's best practice to return both the new access AND refresh token
    return { accessToken, refreshToken }
}

const loginUser = async ({ email, password }) => {
    try {
        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            throw ApiError.unauthorized("user not found")
        }
        if (!user.isVerified) {
            throw ApiError.unauthorized("email not verified")
        }
        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            throw ApiError.unauthorized("invalid credentials")
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

const logOutUser = async (userId) => {
    await User.findByIdAndUpdate(userId, { refreshToken: undefined })
    return { message: "logged out successfully" }
}


const forgotPassword = async ({ email }) => {
    try {
        const user = await User.findOne({ email })
        if (!user) {
            throw ApiError.badRequest("user not found")
        }
        if (!user.isVerified) {
            throw ApiError.unauthorized("email not verified")
        }
        const { rawToken, hashedToken } = generateResetToken()
        user.resetToken = hashedToken
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000
        await user.save()
        try {
            await sendResetPasswordEmail(email, rawToken)
        } catch (error) {
            console.error("Error sending reset password email", error)

        }
        return { message: "Reset password email sent successfully" }

    } catch (error) {
        console.error("Error in forgot password service", error)
        throw error
    }
}

const resetPassword = async({token,password,confirmPassword}) => {
    try {
        const hashedToken = hashToken(token)
        const user = await User.findOne({resetToken: hashedToken}).select("+resetToken +resetTokenExpiry")
        if(!user){
            throw ApiError.unauthorized("invalid token")
        }
        if(user.resetTokenExpiry < Date.now()){
            throw ApiError.unauthorized("token expired")
        }
        if(password !== confirmPassword){
            throw ApiError.unauthorized("passwords do not match")
        }
        user.password = password
        user.resetToken = undefined
        user.resetTokenExpiry = undefined
        await user.save()
        return {message:"password reset successfully"}
    } catch (error) {
        console.error("Error in reset password service", error)
        throw error
    }
}

export {
    registerUser,
    loginUser,
    verifyEmail,
    logOutUser,
    forgotPassword,
    resetPassword
}