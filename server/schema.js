import Joi from "joi"


const userValidationSchema = Joi.object({
    data: Joi.object({
        fullName: Joi.string().required(),
        dob: Joi.string().required(),
        gender: Joi.string.required(),
        profile: Joi.string.required(),
        email: Joi.string
            .email({ tlds: { allow: false } })
            .required()
            .messages({
                "string.email": "Please provide a valid email address",
                "any.required": "Email is required"
            }),
        number: Joi.string.required(),
        password: Joi.string.required()
    })
})

export { userValidationSchema }