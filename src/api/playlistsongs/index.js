const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'playlistsongs',
    version: '1.0.0',
    register: async (server, {
        playlistSongsService,
        playlistsService,
        handleErrorResponse,
        validator
    }) => {
        const playlistsHandler = new PlaylistsHandler(
            playlistSongsService,
            playlistsService,
            handleErrorResponse,
            validator
        );
        server.route(routes(playlistsHandler));
    },
};
