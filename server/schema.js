import Joi from "joi"

const getMinimumAge = () => {
    const today = new Date();
    return new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
    );
};

const userValidationSchema = Joi.object({
    fullName: Joi.string()
        .pattern(/^[A-Za-z\s]+$/)
        .required()
        .messages({
            'string.pattern.base': 'Full name must contain only alphabetical characters and spaces'
        }),

    dateOfBirth: Joi.date()
        .max(getMinimumAge())
        .required()
        .messages({
            'date.max': 'You must be at least 18 years old'
        }),

    gender: Joi.string()
        .valid('Male', 'Female')
        .required()
        .messages({
            'any.only': 'Gender must be either Male or Female',
            'any.required': 'Gender selection is required'
        }),


    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.email': 'Please enter a valid email address'
        }),

    mobileNumber: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            'string.pattern.base': 'Mobile number must be exactly 10 digits'
        }),

    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one number, and one special character'
        }),

})

export { userValidationSchema }


// fullName: Joi.string().required(),
//     dob: Joi.string().required(),
//         gender: Joi.string().required(),
//             email: Joi.string()
//                 .email({ tlds: { allow: false } })
//                 .required()
//                 .messages({
//                     "string.email": "Please provide a valid email address",
//                     "any.required": "Email is required"
//                 }),
//                 number: Joi.string().required(),
//                     password: Joi.string().required()