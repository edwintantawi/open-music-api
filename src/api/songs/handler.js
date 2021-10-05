const { ClinetError } = require('../../exceptions/ClientError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    // this.getSongsHandler = this.getSongsHandler.bind(this);
    // this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    // this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    // this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { title, year, performer, genre, duration } = request.payload;

      const songId = await this._service.addSong({
        title,
        year,
        performer,
        genre,
        duration,
      });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: { songId },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClinetError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // server error
      const response = h.response({
        status: 'error',
        message: 'Server Error',
      });
      response.code(500);
      return response;
    }
  }

  // getSongsHandler() {}

  // getSongByIdHandler(id) {}

  // putSongByIdHandler(id, { title, year, performer, genre, duration }) {}

  // deleteSongByIdHandler(id) {}
}

module.exports = { SongsHandler };
