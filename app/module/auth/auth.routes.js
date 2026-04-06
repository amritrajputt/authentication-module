import { Router } from "express";
import validate from "../../common/middleware/validate.middleware";
import RegisterDto from "./dto/register.dto";
import * as controller from "./auth.controller.js"

const router = Router()
router.post("/register",validate(RegisterDto),controller.register)
router.get("/login",va)