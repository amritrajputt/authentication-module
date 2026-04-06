class ApiResponse{
    constructor (statusCode,message){
        this.statusCode = statusCode
        this.message  = message
    }
    static created(res, message ,data = null){
        return res.json(201).json({
            success:true,
            message,
            data
        })
    }
}