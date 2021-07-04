const SongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'songs',
    version: '1.0.0',
    register: async (server, {
        service,
        handleErrorResponse,
        validator
    }) => {
        const notesHandler = new SongsHandler(
            service,
            handleErrorResponse,
            validator
        );
        server.route(routes(notesHandler));
    },
};
