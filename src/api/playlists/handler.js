const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
    constructor(playlistService, validator, playlistSongsService, validatorPlaylistSong) {
        this._playlistService = playlistService;
        this._validator = validator;
        this._playlistSongsService = playlistSongsService;
        this._validatorPlaylistSong = validatorPlaylistSong;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
        this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
        this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
        this.getPlaylistsSongsHandler = this.getPlaylistsSongsHandler.bind(this);
        this.deletePlaylistSongByIdHandler = this.deletePlaylistSongByIdHandler.bind(this);
    }

    async postPlaylistHandler(request, h) {
        try {
            this._validator.validatePlaylistPayload(request.payload);

            const {name} = request.payload;
            const {id: credentialId} = request.auth.credentials;

            console.log("credential "+ request.auth.credentials.id);

            const playlistId = await this._playlistService.addPlaylist({
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
            return this.handleErrorResponse(h, error);
        }
    }

    async getPlaylistsHandler(request, h) {
        try {
            const {id: credentialId} = request.auth.credentials;

            const playlists = await this._playlistService.getPlaylists(credentialId);
            return {
                status: 'success',
                data: {
                    playlists,
                },
            };
        } catch (error) {
            return this.handleErrorResponse(h, error);
        }
    }

    async deletePlaylistByIdHandler(request, h) {
        try {
            const {id} = request.params;
            const {id: credentialId} = request.auth.credentials;

            await this._playlistService.verifyPlaylistOwner(id, credentialId);
            await this._playlistService.deletePlaylistById(id);
            return {
                status: 'success',
                message: 'Playlist berhasil dihapus',
            };
        } catch (error) {
            return this.handleErrorResponse(h, error);
        }
    }

    // handler for playlistsongs
    async postPlaylistSongHandler(request, h) {
        try {
            const {playlistId} = request.params;
            console.log("cek: "+ playlistId);
            this._validatorPlaylistSong.validatePlaylistSongPayload(request.payload);

            const {songId} = request.payload;

            const playlistSong = await this._playlistSongsService.addPlaylistSong({songId, playlistId});

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
            return this.handleErrorResponse(h, error);
        }
    }

    async getPlaylistsSongsHandler(request, h) {
        try {
            console.log("credential "+ request.auth.credentials);
            const {playlistId} = request.params;
            const {id: credentialId} = request.auth.credentials;

            const songs = await this._playlistSongsService.getPlaylistSongs(playlistId, credentialId);
            return {
                status: 'success',
                data: {
                    songs,
                },
            };
        }catch (error) {
            return this.handleErrorResponse(h, error);
        }
    }

    async deletePlaylistSongByIdHandler(request, h) {
        try {
            const {id} = request.params;
            const {id: credentialId} = request.auth.credentials;

            await  this._playlistSongsService.verifyPlaylistSongOwner(id, credentialId)
            await this._playlistSongsService.deletePlaylistSongById(id);
            return {
                status: 'success',
                message: 'Playlist Song berhasil dihapus',
            };
        } catch (error) {
            return this.handleErrorResponse(h, error);
        }
    }


    handleErrorResponse(h, error) {
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
    }
}

module.exports = PlaylistsHandler;
