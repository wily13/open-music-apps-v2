const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'users',
    version: '1.0.0',
    register: async (server, {
        service,
        handleErrorResponse,
        validator
    }) => {
        const usersHandler = new UsersHandler(
            service,
            handleErrorResponse,
            validator
        );
        server.route(routes(usersHandler));
    },
};
