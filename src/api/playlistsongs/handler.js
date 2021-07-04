const ClientError = require('../../exceptions/ClientError');

class PlaylistSongsHandler {
    constructor(playlistSongService, playlistsService, handleErrorResponse, validator) {
        this._playlistSongService = playlistSongService;
        this._playlistsService = playlistsService;
        this._handleErrorResponse = handleErrorResponse;
        this._validator = validator;

        this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
        this.getPlaylistsSongsHandler = this.getPlaylistsSongsHandler.bind(this);
        this.deletePlaylistSongByIdHandler = this.deletePlaylistSongByIdHandler.bind(this);
    }

    async postPlaylistSongHandler(request, h) {
        try {
            const {playlistId} = request.params;
            this._validator.validatePlaylistSongPayload(request.payload);

            const {songId} = request.payload;
            const {id: credentialId} = request.auth.credentials;

            await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
            const playlistSong = await this._playlistSongService.addPlaylistSong({songId, playlistId});

            const response = h.response({
                status: 'success',
                message: 'Playlist Song berhasil ditambahkan',
                data: {
                    playlistSong,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            return  this._handleErrorResponse.errorResponse(h, error);
        }
    }

    async getPlaylistsSongsHandler(request, h) {
        try {

            const {playlistId} = request.params;
            const {id: credentialId} = request.auth.credentials;

            await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
            const songs = await this._playlistSongService.getPlaylistSongs(playlistId, credentialId);
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

    async deletePlaylistSongByIdHandler(request, h) {
        try {
            const {playlistId} = request.params;
            const {id: credentialId} = request.auth.credentials;
            const {songId} = request.payload;

            await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
            await this._playlistSongService.deletePlaylistSongById(playlistId, songId);
            return {
                status: 'success',
                message: 'Playlist Song berhasil dihapus',
            };
        } catch (error) {
            return  this._handleErrorResponse.errorResponse(h, error);
        }
    }

}

module.exports = PlaylistSongsHandler;
