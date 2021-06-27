const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylistHandler,
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: handler.getPlaylistsHandler,
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlistId}',
        handler: handler.deletePlaylistByIdHandler,
    },
    // {
    //     method: 'POST',
    //     path: '/playlists/{playlistId}/songs',
    //     handler: handler.postPlaylistSongHandler,
    // },
    // {
    //     method: 'GET',
    //     path: '/playlists/{playlistId}/songs',
    //     handler: handler.getPlaylistsSongsHandler,
    // },
    // {
    //     method: 'DELETE',
    //     path: '/playlists/{playlistId}/songs',
    //     handler: handler.deletePlaylistSongsByIdHandler,
    // },
];

module.exports = routes;
