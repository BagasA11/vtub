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

const stopServer = (server) =>
  new Promise((resolve) => server.close(resolve));

describe('createVideoRouter', () => {
  test('GET / memanggil handler list', async () => {
    const handler = {
      list: jest.fn((req, res) => res.status(200).json({ from: 'list' })),
      create: jest.fn(),
    };
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
    const handler = {
      list: jest.fn(),
      create: jest.fn((req, res) =>
        res.status(201).json({ from: 'create' }),
      ),
    };
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
});
