class ApiError extends Error {
    constructor(statusCode, message) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }

    static badRequest(message = "Bad Request") {
        throw ApiError.badRequest("Invalid input")
    }

    static conflict(message = "Conflict") {
        throw ApiError.conflict("Email already in use")
    }

    static unauthorized(message = "unauthorized") {
        return new ApiError(401, message)
    }

    static internal(message = "Internal Server Error") {
        throw ApiError.internal("Invalid input")
    }
}

export default ApiError 