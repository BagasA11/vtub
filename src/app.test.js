import { afterAll, afterEach, beforeAll, expect, jest } from '@jest/globals';
import { createApp } from './app.js';
import { testDataset } from './payload/payload-test.js';
import { VideoHandler } from './api/handlers/video.handlers.js';
import { VideoService } from './services/video.services.js';
import { VideoRepository } from './db/video.repository.js';

/**
 * create handler instance 
 */

const createHandler = () => {
  const repo = new VideoRepository();
  const svc = new VideoService(repo);
  return new VideoHandler(svc);
};

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

// const postData = async ()=>{
  //   const handler = {
  //     list: jest.fn(),
  //     create: jest.fn((req, res) =>
  //       res.status(201).json({ from: 'create', body: req.body }),
  //     ),
  //   };

  //   const { server, baseUrl } = await startServer(
  //     createApp({ videoHandler: handler }),
  //   );

  //   const responses = await Promise.all(
  //   testDataset.map(async (payload) => {
  //     const response = await fetch(`${baseUrl}/videos`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(payload),
  //     });
  //     return { status: response.status, data: await response.json() };
  //   }),
  // );
  // return responses;
// };

describe('createApp', () => {
  
  // start server
  let vhandler, server, baseUrl;
  beforeAll(async () => {
    vhandler = createHandler();
    ({server, baseUrl} = await startServer(
      createApp({ videoHandler:vhandler }),
    ));
  });
  // close server
  afterAll(async ()=> {
    if (server) {
      await stopServer(server);
    }
  });

  // cleanup database after each test run
  afterEach(()=>{
    vhandler.service.repo.clear();
  });

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
    const response = await fetch(`${baseUrl}/videos`);
    const body = await response.json();
    const data = body.data;
    expect(response.status).toBe(200);
    expect(data.length).toBe(0);

    const payload = { judul: 'contoh', mp4file: 'contoh.mp4' };
    try {
      const response = await fetch(`${baseUrl}/videos`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const body = await response.json();
      expect(response.status).toBe(201);
      expect(body.data).toMatchObject(payload);

    } finally {
      console.log('POST /videos');
    }
  });

  test('GET /videos/id', ()=>{
    const payload = { judul: 'contoh', mp4file: 'contoh.mp4' };
    expect(1).toBe(1);
  });

  // test('route selain /videos tidak ditangani router video', async () => {
  //   const handler = {
  //     list: jest.fn(),
  //     create: jest.fn(),
  //   };
  //   const { server, baseUrl } = await startServer(
  //     createApp({ videoHandler: handler }),
  //   );

  //   try {
  //     const response = await fetch(`${baseUrl}/tidak-ada`);

  //     expect(response.status).toBe(404);
  //     expect(handler.list).not.toHaveBeenCalled();
  //     expect(handler.create).not.toHaveBeenCalled();
  //   } finally {
  //     await stopServer(server);
  //   }
  // });
});
