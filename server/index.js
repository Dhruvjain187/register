import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import { ExpressError } from "./utils/ExpressError.js"
import { User } from "./model/user.js"
import { storage } from "./cloudinary/index.js"
import multer from "multer"
import { validateUser } from "./middleware/validate.js"

dotenv.config();
const app = express()
const port = 3000;
const upload = multer({ storage })

app.use(cors({
    origin: "*",
    credentials: true
}))

app.get("/", (req, res) => {
    console.log("hitting")
    res.send("hi")
})

// app.post("/register", async (req, res, next) => {
//     console.log("hitting request")
//     res.send("hi")
// })

app.post("/register", upload.single("profile"),
    validateUser, async (req, res, next) => {
        console.log(req.file, req.body)
        const user = new User({
            fullName: req.body.fullName,
            dob: req.body.dateOfBirth,
            gender: req.body.gender,
            profile: req.file.path,
            email: req.body.email,
            number: req.body.mobileNumber,
            password: req.body.password
        })

        await user.save()
        res.status(200).send("Ok")
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