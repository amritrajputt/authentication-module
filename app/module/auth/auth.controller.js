import * as authService from "./auth.service.js"
import ApiResponse from "../../common/utils/apiResponse.js"
const register = async (req, res) => {
    const user = await authService.register(req.body)
    ApiResponse.created(res, "Registration Success", user)
}
const login = async (req, res) => {
    const {user,accessToken,refreshToken} = await authService.login(req.body)
}
export { register }