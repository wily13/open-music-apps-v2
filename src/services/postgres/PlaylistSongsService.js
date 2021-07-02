const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const {getPlaylistSongMapDBToModel} = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistSongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylistSong({playlistId, songId}) {
        const id = `song-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Song gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getPlaylistSongs(playlistId, credentialId) {
        const query = {
            text: `SELECT playlists.id, songs.title , songs.performer
                FROM playlistsongs
                LEFT JOIN songs ON songs.id = playlistsongs.song_id
                LEFT JOIN playlists ON playlists.id = playlistsongs.playlist_id
                LEFT JOIN users ON users.id = playlists.owner
                WHERE playlists.id = $1
                AND playlists.owner = $2 OR users.id = $2
                GROUP BY playlists.id, songs.title, songs.performer`,
            values: [playlistId, credentialId],
        };
        const result = await this._pool.query(query);
        return result.rows.map(getPlaylistSongMapDBToModel);
    }

    async deletePlaylistSongById(id) {
        const query = {
            text: 'DELETE FROM playlistsongs WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
        }
    }

    async verifyPlaylistSongOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM playlistsongs WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Song tidak ditemukan');
        }
        const playlist = result.rows[0];
        if (playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }
}

module.exports = PlaylistSongsService;
