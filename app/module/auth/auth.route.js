import express from "express"
import { Router } from "express"
import validateMiddleware from "../../common/middleware/validate.middleware.js"
import registerSchema from "./dto/register.dto.js"
import * as controller from "./auth.controller.js"
import { register } from "./auth.controller.js"
import loginSchema from "./dto/login.dto.js"

const router = Router()

router.post("/register", validateMiddleware(registerSchema), controller.register)
router.get("/login",validateMiddleware(loginSchema), controller.login)
router.get("/verify-email", controller.verifyMail)  


export default router