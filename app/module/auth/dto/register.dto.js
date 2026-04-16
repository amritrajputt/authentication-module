import joi from "joi"

const registerSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(128).required(),
    name: joi.string().min(3).max(50).required(),
    role: joi.string().valid('user', 'admin').default('user')
})
export default registerSchema