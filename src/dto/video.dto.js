import { Video } from "../db/video.model";
import { VideoValidationError } from "../errors/app.error";

/**
 * DTO untuk request create video.
 *
 * Field:
 * - judul    : judul video (wajib)
 * - thumbnail: URL/path gambar thumbnail (opsional, default null)
 * - mp4file  : nama file video di folder /files (wajib)
 *
 * `id` tidak termasuk karena dibuat oleh model saat deserialize.
 */
export class VideoCreateDto {
  /**
   * @param {object} props
   * @param {string} props.judul
   * @param {string|null} [props.thumbnail]
   * @param {string} props.mp4file
   */
  constructor({ judul, thumbnail = null, mp4file } = {}) {
    this.judul = judul;
    this.thumbnail = thumbnail;
    this.mp4file = mp4file;
  }

  /**
   * Membuat DTO dari payload request create.
   *
   * Hanya field yang dikenal yang diambil, sehingga field lain (mis. `id`)
   * tidak ikut masuk ke service.
   *
   * @param {object} input
   * @returns {VideoCreateDto}
   */
  static from(input) {
    if (input === null || typeof input !== 'object' || Array.isArray(input)) {
      throw new VideoValidationError(message='VideoCreateDto.from: input harus plain object');
    }

    for (const field of ['judul', 'mp4file']) {
      const value = input[field];

      if (typeof value !== 'string' || value.trim() === '') {
        throw new VideoValidationError(
          message=`VideoCreateDto.from: field "${field}" wajib berupa string tidak kosong`,
          errorField=field
        );
      }
    }

    if (
      input.thumbnail !== undefined &&
      input.thumbnail !== null &&
      typeof input.thumbnail !== 'string'
    ) {
      throw new VideoValidationError(
        'VideoCreateDto.from: field "thumbnail" harus berupa string atau null'
      );
    }

    return new VideoCreateDto({
      judul: input.judul,
      thumbnail: input.thumbnail ?? null,
      mp4file: input.mp4file,
    });
  }
  

}
