import express from 'express';
import { createVideoRouter } from './api/routes/video.routes.js';

/**
 * Membuat instance Express app.
 *
 * Handler bisa di-inject untuk kebutuhan test; jika tidak diberikan,
 * router video membuat VideoHandler default.
 *
 * @param {object} [options]
 * @param {import('./api/handlers/video.handlers.js').VideoHandler} [options.videoHandler]
 * @returns {import('express').Express}
 */
export const createApp = ({ videoHandler } = {}) => {
  const app = express();

  app.use(express.json());
  app.use('/videos', createVideoRouter(videoHandler));

  return app;
};
