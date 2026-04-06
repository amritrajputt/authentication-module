import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config()

async function dbConnect() {
    try {
        await mongoose.connect(process.env.URI)
    } catch (error) {
        console.error(error);
    }

}

export { dbConnect }