import ApiError from "../../common/utils/api-error.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";

 const authMiddleware = (req, res, next) => {
    try {
        // 1. Get the token from the headers
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw ApiError.unauthorized("Access token is missing or invalid format");
        }

        // 2. Extract just the token string (remove "Bearer ")
        const token = authHeader.split(" ")[1];
        
        // 3. Verify and decode the token
        const decoded = verifyAccessToken(token);
        
        // 4. Attach the decoded payload (which contains 'id') to the request!
        req.user = decoded;
        
        next(); // Move on to the controller
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({
            status: "error",
            message: "Unauthorized: Invalid or expired token"
        });
    }
};
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw ApiError.unauthorized("Unauthorized");
        }
        next();
    };
};
export {
    authMiddleware,
    authorizeRoles
}