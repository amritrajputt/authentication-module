import joi from "joi"

const registerSchema = joi.object({
    username: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(128).required(),
    name: joi.string().min(3).max(50).required(),
})
export default registerSchema