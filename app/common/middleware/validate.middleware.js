import BaseDto from "../dto/base.dto";

const validateMiddleware = (DtoClass) => {
    return (req, res, next) => {
        const { data, error } = DtoClass.validate(req.body) 
        if (error) {
            return res.status(400).json({ error })
        }
        req.body = data
        next()
    }   
}
export default validateMiddleware