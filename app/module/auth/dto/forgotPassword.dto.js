import joi from "joi"
const forgotPasswordSchema = joi.object({
    email: joi.string().email().required(),
})

const resetPasswordSchema = joi.object({
    token: joi.string().required(),
    password: joi.string().min(6).max(128).required(),
    confirmPassword: joi.string().min(6).max(128).required()
})

export { forgotPasswordSchema, resetPasswordSchema }  