const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
    constructor(playlistsService, handleErrorResponse, validator) {
        this._playlistsService = playlistsService;
        this._handleErrorResponse = handleErrorResponse;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
        this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    }

    async postPlaylistHandler(request, h) {
        try {
            this._validator.validatePlaylistPayload(request.payload);

            const {name} = request.payload;
            const {id: credentialId} = request.auth.credentials;

            const playlistId = await this._playlistsService.addPlaylist({
                name, owner: credentialId
            });

            const response = h.response({
                status: 'success',
                message: 'Playlist berhasil ditambahkan',
                data: {
                    playlistId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            return  this._handleErrorResponse.errorResponse(h, error);
        }
    }

    async getPlaylistsHandler(request, h) {
        try {
            const {id: credentialId} = request.auth.credentials;

            const playlists = await this._playlistsService.getPlaylists(credentialId);
            return {
                status: 'success',
                data: {
                    playlists,
                },
            };
        } catch (error) {
            return  this._handleErrorResponse.errorResponse(h, error);
        }
    }

    async deletePlaylistByIdHandler(request, h) {
        try {
            const {playlistId} = request.params;
            const {id: credentialId} = request.auth.credentials;

            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
            await this._playlistsService.deletePlaylistById(playlistId, credentialId);
            return {
                status: 'success',
                message: 'Playlist berhasil dihapus',
            };
        } catch (error) {
            return  this._handleErrorResponse.errorResponse(h, error);
        }
    }

}

module.exports = PlaylistsHandler;
