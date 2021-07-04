const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'collaborations',
    version: '1.0.0',
    register: async (server, {
        collaborationsService,
        playlistsService,
        handleErrorResponse,
        validator
    }) => {
        const collaborationsHandler = new CollaborationsHandler(
            collaborationsService,
            playlistsService,
            handleErrorResponse,
            validator,
        );
        server.route(routes(collaborationsHandler));
    },
};
