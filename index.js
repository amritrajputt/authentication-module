import mongoose from "mongoose";
import { dbConnect } from "./app/common/config/dbConnection.js";
import app from "./app/server.js";
import dotenv from "dotenv"
dotenv.config()

const port = process.env.PORT || 8080

async function startServer() {
    try {

        await dbConnect()
        app.get('/',(req,res) => console.log("hello from express!"))
        app.listen(() => {
            console.log(`server runs on port, ${port}`);
        })

    } catch (error) {
        console.error(error)
    }
}

startServer()