import mongoose from "mongoose"

const { Schema } = mongoose;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    dob: String,
    gender: String,
    profile: String,
    email: {
        type: String,
        required: true
    },
    number: Number,
    password: String
})

const User = mongoose.model("User", userSchema)

export { User }