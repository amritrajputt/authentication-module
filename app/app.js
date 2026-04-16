import express from "express"
import authRoutes from "./module/auth/auth.route.js"
import cookieParser from "cookie-parser"


const app = express()

app.use(express.json())
app.use(cookieParser())  
app.use(express.urlencoded({ extended: true }))

app.use("/auth", authRoutes)

export {app} 