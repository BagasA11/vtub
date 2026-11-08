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
   * @param {string} props.id
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
   * Mengubah plain object atau string JSON menjadi instance Video.
   *
   * @param {object|string} input
   * @returns {Video}
   */
  static deserialize(input) {
    const data = typeof input === 'string' ? JSON.parse(input) : input;

    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
      throw new TypeError('Video.deserialize: input harus plain object atau string JSON');
    }

    const requiredFields = ['id', 'judul', 'mp4file'];

    for (const field of requiredFields) {
      const value = data[field];

      if (typeof value !== 'string' || value.trim() === '') {
        throw new TypeError(
          `Video.deserialize: field "${field}" wajib berupa string tidak kosong`,
        );
      }
    }

    if (
      data.thumbnail !== undefined &&
      data.thumbnail !== null &&
      typeof data.thumbnail !== 'string'
    ) {
      throw new TypeError('Video.deserialize: field "thumbnail" harus berupa string atau null');
    }

    return new Video({
      id: data.id,
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
