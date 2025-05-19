import express from "express"
import mongoose from "mongoose"
import cors from "cors"
// import { ExpressError } from "./utils/ExpressError"
import { ExpressError } from "./utils/ExpressError.js"
import { User } from "./model/user.js"

const app = express()
const port = 3000;

app.use(cors({
    origin: "*",
    credentials: true
}))

app.get("/", (req, res) => {
    console.log("hitting")
    res.send("hi")
})

app.post("/register", async (req, res, next) => {
    res.send("hi")
})

app.all('*all', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).send(err)
})


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/resgister');
    console.log("db connected")
}

app.listen(port, () => {
    console.log(`listening at port ${port}`)
})