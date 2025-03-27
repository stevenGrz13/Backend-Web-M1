class ApiResponse {
    constructor(statusCode, data, message = "Success", pagination = null) {
        this.success = statusCode < 400;
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
        this.pagination = pagination;
    }

    send(res) {
        const response = {
            success: this.success,
            data: this.data,
            message: this.message
        };

        if (this.pagination) {
            response.pagination = this.pagination;
        }

        return res.status(this.statusCode).json(response);
    }


    static paginate(res, data, pagination, message = "Success") {
        return new ApiResponse(200, data, message, pagination).send(res);
    }
}

module.exports = ApiResponse;
