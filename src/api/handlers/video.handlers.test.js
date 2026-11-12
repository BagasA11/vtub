import { describe, expect, jest, test } from '@jest/globals';
import { VideoHandler } from './video.handlers.js';
import { NotFoundError } from '../../errors/app.error.js';
import {
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NOT_FOUND,
  HTTP_OK,
} from './statuscode.js';

const buatVideo = (overrides = {}) => ({
  id: 'video-1',
  judul: 'marsha and the bear',
  thumbnail: null,
  mp4file: 'eps_1.mp4',
  ...overrides,
});

/**
 * Objek response Express tiruan untuk menguji handler tanpa HTTP server.
 *
 * @returns {{ status: jest.Mock, json: jest.Mock }}
 */
const buatRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('VideoHandler.findByID', () => {
  test('mengembalikan video dalam envelope data', async () => {
    const video = buatVideo();
    const svc = {
      findByID: jest.fn(() => video),
    };
    const handler = new VideoHandler(svc);
    const req = { params: { videoId: video.id } };
    const res = buatRes();

    await handler.findByID(req, res);

    expect(svc.findByID).toHaveBeenCalledWith(video.id);
    expect(res.status).toHaveBeenCalledWith(HTTP_OK);
    expect(res.json).toHaveBeenCalledWith({
      status: HTTP_OK,
      message: 'success',
      data: video,
    });
  });

  test('mengembalikan 404 dengan data null jika video tidak ditemukan', async () => {
    const svc = {
      findByID: jest.fn(() => {
        throw new NotFoundError('Video tidak ditemukan');
      }),
    };
    const handler = new VideoHandler(svc);
    const req = { params: { videoId: 'tidak-ada' } };
    const res = buatRes();

    await handler.findByID(req, res);

    expect(res.status).toHaveBeenCalledWith(HTTP_NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      status: HTTP_NOT_FOUND,
      message: 'Video tidak ditemukan',
      data: null,
    });
  });

  test('mengembalikan 500 jika terjadi error lain', async () => {
    const svc = {
      findByID: jest.fn(() => {
        throw new Error('boom');
      }),
    };
    const handler = new VideoHandler(svc);
    const req = { params: { videoId: 'video-1' } };
    const res = buatRes();

    await handler.findByID(req, res);

    expect(res.status).toHaveBeenCalledWith(HTTP_INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      status: HTTP_INTERNAL_SERVER_ERROR,
      message: 'Terjadi kesalahan pada server',
      data: null,
    });
  });
});

describe('VideoHandler.delete', () => {
  test('mengembalikan video yang dihapus dalam envelope data', async () => {
    const video = buatVideo();
    const svc = {
      delete: jest.fn(() => video),
    };
    const handler = new VideoHandler(svc);
    const req = { params: { videoId: video.id } };
    const res = buatRes();

    await handler.delete(req, res);

    expect(svc.delete).toHaveBeenCalledWith(video.id);
    expect(res.status).toHaveBeenCalledWith(HTTP_OK);
    expect(res.json).toHaveBeenCalledWith({
      status: HTTP_OK,
      message: 'Video berhasil dihapus',
      data: video,
    });
  });

  test('mengembalikan 404 dengan data null jika video tidak ditemukan', async () => {
    const svc = {
      delete: jest.fn(() => {
        throw new NotFoundError('Video tidak ditemukan');
      }),
    };
    const handler = new VideoHandler(svc);
    const req = { params: { videoId: 'tidak-ada' } };
    const res = buatRes();

    await handler.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(HTTP_NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      status: HTTP_NOT_FOUND,
      message: 'Video tidak ditemukan',
      data: null,
    });
  });

  test('mengembalikan 500 jika terjadi error lain', async () => {
    const svc = {
      delete: jest.fn(() => {
        throw new Error('boom');
      }),
    };
    const handler = new VideoHandler(svc);
    const req = { params: { videoId: 'video-1' } };
    const res = buatRes();

    await handler.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(HTTP_INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      status: HTTP_INTERNAL_SERVER_ERROR,
      message: 'Terjadi kesalahan pada server',
      data: null,
    });
  });
});
