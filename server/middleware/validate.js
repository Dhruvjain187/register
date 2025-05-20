import { userValidationSchema } from "../schema.js";
import { ExpressError } from "../utils/ExpressError.js";

export const validateUser = (req, res, next) => {
    console.log({ ...req.body })

    const { error } = userValidationSchema.validate({
        fullName: req.body.fullName,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
        password: req.body.password
    })

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        console.log("msg=", msg)
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

export const data = 123