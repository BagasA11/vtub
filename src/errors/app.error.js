/**
 * Base error untuk error yang sudah dipetakan ke status HTTP.
 */
export class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} [status]
   * @param {string} [code]
   */
  constructor(message, status = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = new.target.name;
    this.status = status;
    this.code = code;
  }
}

/**
 * Error validasi data video (payload create/update tidak valid).
 */
export class VideoValidationError extends AppError {
  /**
   * @param {string} [message]
   */
  constructor(message = 'Data video tidak valid') {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

/**
 * Error ketika data yang diminta tidak ditemukan.
 */
export class NotFoundError extends AppError {
  /**
   * @param {string} [message]
   */
  constructor(message = 'Data tidak ditemukan') {
    super(message, 404, 'NOT_FOUND');
  }
}
