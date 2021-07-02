const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists/{playlistId}/songs',
        handler: handler.postPlaylistSongHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{playlistId}/songs',
        handler: handler.getPlaylistsSongsHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlistId}/songs',
        handler: handler.deletePlaylistSongByIdHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    },
];

module.exports = routes;
