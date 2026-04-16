import BaseDto from "../dto/base.dto.js";

const validateMiddleware = (DtoClass) => {
    return (req, res, next) => {
        const { value, error } = DtoClass.validate(req.body)
        if (error) {
            return res.status(400).json({ error })
        }
        req.body = value
        next()
    }
}
export default validateMiddleware