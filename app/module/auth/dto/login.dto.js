import BaseDto from "../../../common/dto/base.dto";
import joi from "joi";
class LoginDto extends BaseDto{
    static schema = joi.object({
        email:joi.string().email().lowercase().required(),
        password:joi.string().required()
    })
}
export default LoginDto