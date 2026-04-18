import ApiError from "../../common/utils/api-error.js"
import ApiResponse from "../../common/utils/Api-Response.js"
import { registerUser,loginUser,verifyEmail } from "./auth.service.js"

const register = async (req, res) => {
    try {
        const user = await registerUser(req.body)
        return ApiResponse.success(res, user, "User registered successfully")
    } catch (error) {
        console.error("Error in register controller", error)
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                status: "error",
                message: error.message
            })
        } else {
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error"
            })
        }
    }
}
const verifyMail = async (req, res) => {
    try {
        const { token } = req.query  
        const result = await verifyEmail(token)
        return ApiResponse.success(res, result, "Email verified successfully")
    } catch (error) {
        console.error("Error in verify email controller", error)
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                status: "error",
                message: error.message
            })
        }
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const tokens = await loginUser({ email, password })
        const { accessToken, refreshToken } = tokens
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        return ApiResponse.success(res, {accessToken}, "Login successful")
    } catch (error) {
        console.error("Error in login controller", error)
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                status: "error",
                message: error.message
            })
        } else {
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error"
            })
        }
    }
}

export {
    register,login,verifyMail

}