const ClientError = require('../../exceptions/ClientError');

class UsersHandler {
    constructor(service, handleErrorResponse, validator) {
        this._service = service;
        this._handleErrorResponse = handleErrorResponse;
        this._validator = validator;

        this.postUserHandler = this.postUserHandler.bind(this);
    }

    async postUserHandler(request, h) {
        try {
            this._validator.validateUserPayload(request.payload);
            const { username, password, fullname } = request.payload;

            const userId = await this._service.addUser({ username, password, fullname });

            const response = h.response({
                status: 'success',
                message: 'User berhasil ditambahkan',
                data: {
                    userId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            return  this._handleErrorResponse.errorResponse(h, error);
        }
    }
}

module.exports = UsersHandler;
