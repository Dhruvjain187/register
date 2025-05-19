import { userValidationSchema } from "../schema.js";
import { ExpressError } from "../utils/ExpressError.js";

const validateUser = (req, res, next) => {
    const { error } = userValidationSchema(req.body)

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        console.log("msg=", msg)
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}