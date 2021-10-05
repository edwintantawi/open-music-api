const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { InvariantError } = require('../../exceptions/InvariantError');
const { NotFoundError } = require('../../exceptions/NotFoundError');
const { mapSongTableToModel } = require('../../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration }) {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const query = {
      text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        insertedAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) throw new InvariantError('Song failed to add');

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query(
      'SELECT id, title, performer FROM songs'
    );
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song with that id not found');
    }

    return result.rows.map(mapSongTableToModel)[0];
  }

  // async editSongById(id, { title, year, performer, genre, duration }) {}

  // async deleteSongById(id) {}
}

module.exports = { SongsService };
