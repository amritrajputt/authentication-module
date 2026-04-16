class ApiResponse {
    static success(res, data = null, message = "Success") {
        return res.status(200).json({
            status: "success",
            message,
            data
        })
    }
}
export default ApiResponse