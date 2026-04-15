import dotenv from "dotenv"
import connectDb  from "./app/common/config/dbConfig.js"
import { app } from "./app/app.js"

dotenv.config()

const startServer = async () => {
    const port = process.env.PORT || 3000
    await connectDb()
    app.listen(port, () => console.log(`server runs on port, ${port}`))
}
startServer().catch((err) => {
    console.error("Failed to start server", err)
    process.exit(1)
})

