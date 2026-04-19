import express from "express"
import { Router } from "express"
import validateMiddleware from "../../common/middleware/validate.middleware.js"
import registerSchema from "./dto/register.dto.js"
import * as controller from "./auth.controller.js"
import { register } from "./auth.controller.js"
import loginSchema from "./dto/login.dto.js"
import { authMiddleware } from "./auth.middleware.js"
import { forgotPasswordSchema, resetPasswordSchema } from "./dto/forgotPassword.dto.js"

const router = Router()

router.post("/register", validateMiddleware(registerSchema), controller.register)
router.post("/login",validateMiddleware(loginSchema), controller.login)
router.get("/verify-email/:token", controller.verifyMail)  
router.post("/logout", authMiddleware, controller.logOut)
router.post("/forgot-password", validateMiddleware(forgotPasswordSchema), controller.forgotPassword)
router.post("/reset-password", validateMiddleware(resetPasswordSchema), controller.resetPassword)

export default router