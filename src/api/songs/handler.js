const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
    constructor(service, handleErrorResponse, validator) {
        this._service = service;
        this._handleErrorResponse = handleErrorResponse;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    async postSongHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);

            const {title = 'untitled', year, performer, genre, duration} = request.payload;

            const songId = await this._service.addSong({title, year, performer, genre, duration});

            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan',
                data: {
                    songId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            return  this._handleErrorResponse.errorResponse(h, error);
        }
    }

    async getSongsHandler(h) {
        try {
            const songs = await this._service.getSongs();
            return {
                status: 'success',
                data: {
                    songs,
                },
            };
        }catch (error) {
            return  this._handleErrorResponse.errorResponse(h, error);
        }
    }

    async getSongByIdHandler(request, h) {
        try {
            const {id} = request.params;
            const song = await this._service.getSongById(id);
            return {
                status: 'success',
                data: {
                    song,
                },
            };
        } catch (error) {
            return  this._handleErrorResponse.errorResponse(h, error);
        }
    }

    async putSongByIdHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);
            const {id} = request.params;

            await this._service.editSongById(id, request.payload);

            return {
                status: 'success',
                message: 'Lagu berhasil diperbarui',
            };
        } catch (error) {
            return  this._handleErrorResponse.errorResponse(h, error);
        }
    }

    async deleteSongByIdHandler(request, h) {
        try {
            const {id} = request.params;
            await this._service.deleteSongById(id);
            return {
                status: 'success',
                message: 'Lagu berhasil dihapus',
            };
        } catch (error) {
            return  this._handleErrorResponse.errorResponse(h, error);
        }
    }

    //  handleErrorResponse(h, error){
    //     if (error instanceof ClientError) {
    //         const response = h.response({
    //             status: 'fail',
    //             message: error.message,
    //         });
    //         response.code(error.statusCode);
    //         return response;
    //     }
    //
    //     // Server ERROR!
    //     const response = h.response({
    //         status: 'error',
    //         message: 'Maaf, terjadi kegagalan pada server kami.',
    //     });
    //     response.code(500);
    //     console.error(error);
    //     return response;
    // }
}

module.exports = SongsHandler;
