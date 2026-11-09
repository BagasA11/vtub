import { jest } from '@jest/globals';
import { createApp } from './app.js';

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

describe('createApp', () => {
  test('GET /videos memakai handler list', async () => {
    const handler = {
      list: jest.fn((req, res) => res.status(200).json({ from: 'list' })),
      create: jest.fn(),
    };
    const { server, baseUrl } = await startServer(
      createApp({ videoHandler: handler }),
    );

    try {
      const response = await fetch(`${baseUrl}/videos`);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({ from: 'list' });
      expect(handler.list).toHaveBeenCalledTimes(1);
    } finally {
      await stopServer(server);
    }
  });

  test('POST /videos mem-parse body JSON lalu memakai handler create', async () => {
    const payload = { judul: 'contoh', mp4file: 'contoh.mp4' };
    const handler = {
      list: jest.fn(),
      create: jest.fn((req, res) =>
        res.status(201).json({ from: 'create', body: req.body }),
      ),
    };
    const { server, baseUrl } = await startServer(
      createApp({ videoHandler: handler }),
    );

    try {
      const response = await fetch(`${baseUrl}/videos`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body).toEqual({ from: 'create', body: payload });
      expect(handler.create).toHaveBeenCalledTimes(1);
    } finally {
      await stopServer(server);
    }
  });

  test('route selain /videos tidak ditangani router video', async () => {
    const handler = {
      list: jest.fn(),
      create: jest.fn(),
    };
    const { server, baseUrl } = await startServer(
      createApp({ videoHandler: handler }),
    );

    try {
      const response = await fetch(`${baseUrl}/tidak-ada`);

      expect(response.status).toBe(404);
      expect(handler.list).not.toHaveBeenCalled();
      expect(handler.create).not.toHaveBeenCalled();
    } finally {
      await stopServer(server);
    }
  });
});
