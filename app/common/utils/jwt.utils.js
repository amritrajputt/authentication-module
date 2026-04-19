import crypto from "crypto"
import jwt from "jsonwebtoken"
import { User } from "../../module/auth/auth.model.js"
import dotenv from "dotenv"
dotenv.config()


const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" })
}

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" })
}


const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        console.error("Invalid access token", error)
        throw new Error("Invalid access token")
    }
}

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        console.error("Invalid refresh token", error)
        throw new Error("Invalid refresh token")
    }
}

const generateResetToken = () => {
    const rawToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")
    return { rawToken, hashedToken }
}

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    generateResetToken
}