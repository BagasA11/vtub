import { v4 as uuidv4 } from 'uuid';

/**
 * Model domain Video.
 *
 * Field:
 * - id       : string unik video
 * - judul    : judul video
 * - thumbnail: URL/path gambar thumbnail (opsional, default null)
 * - mp4file  : nama file video di folder /files
 */
export class Video {
  /**
   * @param {object} props
   * @param {string} [props.id] id dibuat otomatis jika tidak diberikan
   * @param {string} props.judul
   * @param {string|null} [props.thumbnail]
   * @param {string} props.mp4file
   */
  constructor({ id, judul, thumbnail = null, mp4file } = {}) {
    this.id = id;
    this.judul = judul;
    this.thumbnail = thumbnail;
    this.mp4file = mp4file;
  }

  /**
   * Membuat id unik untuk Video.
   *
   * @returns {string} UUID v4
   */
  static generateId() {
    return uuidv4();
  }

  /**
   * Mengubah plain object atau string JSON menjadi instance Video.
   *
   * Field "id" opsional; jika tidak ada atau kosong, id dibuat dengan
   * {@link Video.generateId}.
   *
   * @param {object|string} input
   * @returns {Video}
   */
  static deserialize(input) {
    const data = typeof input === 'string' ? JSON.parse(input) : input;

    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
      throw new TypeError('Video.deserialize: input harus plain object atau string JSON');
    }

    const requiredFields = ['judul', 'mp4file'];

    for (const field of requiredFields) {
      const value = data[field];

      if (typeof value !== 'string' || value.trim() === '') {
        throw new TypeError(
          `Video.deserialize: field "${field}" wajib berupa string tidak kosong`,
        );
      }
    }

    if (data.id !== undefined && data.id !== null && typeof data.id !== 'string') {
      throw new TypeError('Video.deserialize: field "id" harus berupa string');
    }

    if (
      data.thumbnail !== undefined &&
      data.thumbnail !== null &&
      typeof data.thumbnail !== 'string'
    ) {
      throw new TypeError('Video.deserialize: field "thumbnail" harus berupa string atau null');
    }

    const id =
      typeof data.id === 'string' && data.id.trim() !== ''
        ? data.id
        : Video.generateId();

    return new Video({
      id,
      judul: data.judul,
      thumbnail: data.thumbnail ?? null,
      mp4file: data.mp4file,
    });
  }

  /**
   * Mengubah instance Video menjadi plain object.
   *
   * @returns {{ id: string, judul: string, thumbnail: string|null, mp4file: string }}
   */
  serialize() {
    return {
      id: this.id,
      judul: this.judul,
      thumbnail: this.thumbnail,
      mp4file: this.mp4file,
    };
  }

  /**
   * Hook bawaan JSON.stringify().
   *
   * @returns {{ id: string, judul: string, thumbnail: string|null, mp4file: string }}
   */
  toJSON() {
    return this.serialize();
  }
}
