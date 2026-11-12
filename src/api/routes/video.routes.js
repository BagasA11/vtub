import { Router } from 'express';
import { createHandler } from '../handlers/video.handlers.js';

/**
 * Membuat router untuk resource video.
 *
 * @param {VideoHandler} handler
 * @returns {import('express').Router}
 */
export const createVideoRouter = (handler = createHandler) => {
  const router = Router();

  router.get('/', handler.list);
  router.post('/', handler.create);
  router.get('/:videoId', handler.findByID);
  router.delete('/:videoId', handler.delete);

  return router;
};
