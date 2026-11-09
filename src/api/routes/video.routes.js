import { Router } from 'express';
import { VideoHandler } from '../handlers/video.handlers.js';

/**
 * Membuat router untuk resource video.
 *
 * @param {VideoHandler} handler
 * @returns {import('express').Router}
 */
export const createVideoRouter = (handler = new VideoHandler()) => {
  const router = Router();

  router.get('/', handler.list);
  router.post('/', handler.create);

  return router;
};
