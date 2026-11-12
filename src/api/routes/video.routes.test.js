import express from 'express';
import { jest } from '@jest/globals';
import { createVideoRouter } from './video.routes.js';

/**
 * Menjalankan app pada port acak agar test tidak bentrok.
 *
 * @param {import('express').Express} app
 * @returns {Promise<{ server: import('http').Server, baseUrl: string }>}
 */
const startServer = (app) =>
  new Promise((resolve) => {
    const server = app.listen(0, '127.0.0.1', () => {
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${server.address().port}`,
      });
    });
  });

const stopServer = (server) => new Promise((resolve) => {
  server.closeAllConnections();
  server.close(resolve);
});

/**
 * Membuat mock handler lengkap agar router bisa didaftarkan.
 *
 * @param {object} [overrides]
 * @returns {{ list: jest.Mock, create: jest.Mock, findByID: jest.Mock, delete: jest.Mock }}
 */
const createMockHandler = (overrides = {}) => ({
  list: jest.fn(),
  create: jest.fn(),
  findByID: jest.fn(),
  delete: jest.fn(),
  ...overrides,
});

describe('createVideoRouter', () => {
  test('GET / memanggil handler list', async () => {
    const handler = createMockHandler({
      list: jest.fn((req, res) => res.status(200).json({ from: 'list' })),
    });
    const app = express();
    app.use(express.json());
    app.use(createVideoRouter(handler));

    const { server, baseUrl } = await startServer(app);

    try {
      const response = await fetch(`${baseUrl}/`);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({ from: 'list' });
      expect(handler.list).toHaveBeenCalledTimes(1);
      expect(handler.create).not.toHaveBeenCalled();
    } finally {
      await stopServer(server);
    }
  });

  test('POST / memanggil handler create', async () => {
    const handler = createMockHandler({
      create: jest.fn((req, res) =>
        res.status(201).json({ from: 'create' }),
      ),
    });
    const app = express();
    app.use(express.json());
    app.use(createVideoRouter(handler));

    const { server, baseUrl } = await startServer(app);

    try {
      const response = await fetch(`${baseUrl}/`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ judul: 'contoh', mp4file: 'contoh.mp4' }),
      });
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body).toEqual({ from: 'create' });
      expect(handler.create).toHaveBeenCalledTimes(1);
      expect(handler.list).not.toHaveBeenCalled();
    } finally {
      await stopServer(server);
    }
  });

  test('GET /:videoId memanggil handler findByID', async () => {
    const handler = createMockHandler({
      findByID: jest.fn((req, res) =>
        res.status(200).json({ from: 'findByID', id: req.params.videoId }),
      ),
    });
    const app = express();
    app.use(express.json());
    app.use(createVideoRouter(handler));

    const { server, baseUrl } = await startServer(app);

    try {
      const response = await fetch(`${baseUrl}/video-123`);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({ from: 'findByID', id: 'video-123' });
      expect(handler.findByID).toHaveBeenCalledTimes(1);
      expect(handler.list).not.toHaveBeenCalled();
      expect(handler.create).not.toHaveBeenCalled();
      expect(handler.delete).not.toHaveBeenCalled();
    } finally {
      await stopServer(server);
    }
  });

  test('DELETE /:videoId memanggil handler delete', async () => {
    const handler = createMockHandler({
      delete: jest.fn((req, res) =>
        res.status(200).json({ from: 'delete', id: req.params.videoId }),
      ),
    });
    const app = express();
    app.use(express.json());
    app.use(createVideoRouter(handler));

    const { server, baseUrl } = await startServer(app);

    try {
      const response = await fetch(`${baseUrl}/video-123`, {
        method: 'DELETE',
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({ from: 'delete', id: 'video-123' });
      expect(handler.delete).toHaveBeenCalledTimes(1);
      expect(handler.list).not.toHaveBeenCalled();
      expect(handler.create).not.toHaveBeenCalled();
      expect(handler.findByID).not.toHaveBeenCalled();
    } finally {
      await stopServer(server);
    }
  });
});
