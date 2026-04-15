import mongoose from 'mongoose'
import dotenv from "dotenv"
dotenv.config()

const connectDb = async () => {
    if (!process.env.DB_URL) {
        throw new Error("Missing DB_URL in environment")
    }

    try {
       await mongoose.connect(process.env.DB_URL)
        console.log("Connected to MongoDB Atlas")
    } catch (error) {
        console.error("error connecting to DB", error)
        throw error
    }
}
export default connectDb