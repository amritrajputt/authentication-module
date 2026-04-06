import ApiError from '../../common/utils/apiError'
import ApiResponse from '../../common/utils/apiResponse.js'
import { generateResetToken } from '../../common/utils/jwt.utils'
import User from './auth.model.js'
import bcrypt from "bcrypt"
const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex")
}

const register = async ({ name, email, password, role }) => {
    const isUserExists = await User.findOne({ email: email })
    if (isUserExists) return ApiError.conflict("Email already exisits")
    const { rawToken, hashedToken } = generateResetToken()
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        name,
        email,
        hashedPassword,
        role,
        verificationToken: hashedToken,
    });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.verificationToken;
    return userObj;
}

const login = async ({ email, password }) => {
    const isUser = await User.findOne({ email: email }).select("+password")
    if (!isUser) throw new ApiError.unAuthorized("Invalid Email or Password")
    const extractOriginalPassword = await bcrypt.compare(password, isUser.password)

    if (isUser && password !== extractOriginalPassword){
        throw new ApiError.unAuthorized("Invalid Email or Password")
    }
    const user = ""
    if (isUser && password === extractOriginalPassword){
        throw new ApiResponse.ok(res,"You are logged in!",user)
    }

}

export { register }