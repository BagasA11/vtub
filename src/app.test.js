import { afterAll, afterEach, beforeAll, expect, jest } from '@jest/globals';
import { createApp } from './app.js';
import { testDataset } from './payload/payload-test.js';
import { VideoHandler } from './api/handlers/video.handlers.js';
import { VideoService } from './services/video.services.js';
import { VideoRepository } from './db/video.repository.js';
import { NotFoundError } from './errors/app.error.js';
import { HTTP_NOT_FOUND, HTTP_OK } from './api/handlers/statuscode.js';

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

const stopServer = (server) => {
  if (!server || !server.listening) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    server.close(resolve);
    server.closeAllConnections();
  });
};

const postData = async (baseUrl)=>{
  const responses = await Promise.all(
    testDataset.map(async (payload) => {
      const response = await fetch(`${baseUrl}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return { status: response.status, body: await response.json() };
    }),
  );
  return responses;
};

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
    
    try {
      const response = await fetch(`${baseUrl}/videos`);
      const body = await response.json();

      expect(response.status).toBe(200);
    } finally {

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

  test('GET /videos/id', async ()=>{
    // return not found
    let response = await fetch(`${baseUrl}/videos/x123xx`);
    expect(response.status).toBe(HTTP_NOT_FOUND);

    response = await postData(baseUrl);
    const first = response[0].body.data;

    try {
      const response = await fetch(`${baseUrl}/videos/${first.id}`);
      const body = await response.json();
      
      expect(response.status).toBe(HTTP_OK);
      expect(body.data).toMatchObject(first);

    } finally {
      console.log('GET /videos/id DONE');
    }
  });

  test('DELETE /:id', async ()=>{
    let response = await fetch(`${baseUrl}/videos/xx123xx`, {
      method: 'DELETE'
    });
    expect(response.status).toBe(HTTP_NOT_FOUND);

    const responses = await postData(baseUrl);
    const last_data = responses.at(-1).body.data;

    try {
      let response = await fetch(`${baseUrl}/videos/${last_data.id}`, {
        method: 'DELETE'
      });
      expect(response.status).toBe(HTTP_OK); 

      // must be not found since removed
      response = await fetch(`${baseUrl}/videos/${last_data.id}`)
      const {status, message, data} = await response.json();
      expect(response.status).toBe(HTTP_NOT_FOUND);
      expect(data).toBe(null);

    } finally {}
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
