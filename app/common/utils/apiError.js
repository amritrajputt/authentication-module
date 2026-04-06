class ApiError extends Error{
    constructor (statusCode,message){
        this.statusCode = statusCode
        this.isOperational = true;
        Error.captureStackTrace(this,this.constructor)
    }

    static badRequest(message = "Bad Request"){
        return new ApiError(400,message)
    }
    static conflict(message = "Conflit Request"){
        return new ApiError(409,message)
    }
    static unAuthorized(message = "UnAuthorized"){
        return new ApiError(401,message)
    }
} 
export default ApiError