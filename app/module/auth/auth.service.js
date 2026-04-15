import express from "express"
import { User } from "./auth.model"
import  * as jwtUtils from "../../common/utils/jwt.utils"

const register = async ({ email, password, name }) => {
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            throw new Error("Email already in use")
        }
        const {rawToken,hashedToken} = jwtUtils.generateResetToken()
        const user = new User({ email, password, name })
        const userObject = user.toObject()
        delete userObject.password
       
        return userObject
    } catch (error) {
        console.error("Error in register service", error)
        throw error
    }
}

export {
    register
}