import ApiError from '../../common/utils/apiError'
import { generateResetToken } from '../../common/utils/jwt.utils'
import User from './auth.model.js'
const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex")
}

const register = async ({ name, email, password, role }) => {
    const isUserExists = await User.findOne({ email: email })
    if (isUserExists) return ApiError.conflict("Email already exisits")
    const { rawToken, hashedToken } = generateResetToken()
    const user = await User.create({
        name,
        email,
        password,
        role,
        verificationToken: hashedToken,
    });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.verificationToken;

    return userObj;
}


export{register}