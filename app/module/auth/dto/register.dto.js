import joi, { required } from 'joi'
import BaseDto from '../../../common/dto/base.dto'

class RegisterDto extends BaseDto {
    static schema = joi.object({
        name: joi.string().trim().min(2).max(40).required(),
        email: joi.string().lowercase().email().required(),
        password: joi.string().trim().min(8).required().message("Password must contain 8 chars minimum"),
        role:joi.string().trim().valid("customer","seller").default("customer")
    })
}
export default RegisterDto