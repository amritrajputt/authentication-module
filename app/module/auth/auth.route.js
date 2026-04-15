import express from "express"
import { Router } from "express"
import validateMiddleware from "../../common/middleware/validate.middleware"
import registerSchema from "./dto/register.dto"
import * as controller from "./auth.controller"
const router = Router()

router.get("/register", validateMiddleware(registerSchema),controller.register)