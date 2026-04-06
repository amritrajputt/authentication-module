import express, { urlencoded } from "express"

const app = express()
app.use(express.json())
app.use(  express.urlencoded({
        extended: true,
        type: "application/json",
    }))

export default app