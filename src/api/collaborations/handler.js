const ClientError = require('../../exceptions/ClientError');

class CollaborationsHandler {
    constructor(collaborationsService, playlistsService, handleErrorResponse, validator) {
        this._collaborationsService = collaborationsService;
        this._playlistsService = playlistsService;
        this._handleErrorResponse = handleErrorResponse;
        this._validator = validator;

        this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
        this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
    }

    async postCollaborationHandler(request, h) {
        try {
            this._validator.validateCollaborationPayload(request.payload);

            const { id: credentialId } = request.auth.credentials;
            const { playlistId, userId } = request.payload;
            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

            const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

            const response = h.response({
                status: 'success',
                message: 'Kolaborasi berhasil ditambahkan',
                data: {
                    collaborationId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            return  this._handleErrorResponse.errorResponse(h, error);
        }
    }

    async deleteCollaborationHandler(request, h) {
        try {
            this._validator.validateCollaborationPayload(request.payload);
            const { id: credentialId } = request.auth.credentials;
            const { playlistId, userId } = request.payload;

            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
            await this._collaborationsService.deleteCollaboration(playlistId, userId);

            return {
                status: 'success',
                message: 'Kolaborasi berhasil dihapus',
            };
        } catch (error) {
            return  this._handleErrorResponse.errorResponse(h, error);
        }
    }
}

module.exports = CollaborationsHandler;
