const ClientError = require('../exceptions/ClientError');

const HandleErrorResponse = {
    errorResponse: (h, error) => {
        try {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        } catch (e) {
            throw new ClientError('Error clien not valid');
        }
    }
};

module.exports = HandleErrorResponse;
