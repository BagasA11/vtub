import { Video } from './video.model.js';

/**
 * Penyimpanan in-memory untuk Video.
 *
 * Store menyimpan plain object hasil serialize(), sehingga instance yang
 * dikembalikan tidak pernah berbagi referensi dengan data di dalam store.
 */
export class VideoRepository {
  /** @type {Map<string, { id: string, judul: string, thumbnail: string|null, mp4file: string }>} */
  #store = new Map();

  /**
   * Membuat instance Video baru dari data di store.
   *
   * @param {{ id: string, judul: string, thumbnail: string|null, mp4file: string }} data
   * @returns {Video}
   */
  #toVideo(data) {
    return Video.deserialize({ ...data });
  }

  /**
   * Menambah entry baru atau menimpa entry dengan id yang sama.
   *
   * @param {Video} video
   * @returns {Video}
   */
  save(video) {
    const data = video.serialize();
    this.#store.set(data.id, data);
    return this.#toVideo(data);
  }

  /**
   * Mengambil semua video sesuai urutan insertion.
   *
   * @returns {Video[]}
   */
  findAll() {
    return Array.from(this.#store.values(), (data) => this.#toVideo(data));
  }

  /**
   * @param {string} id
   * @returns {Video|null} null jika id tidak dikenal
   */
  findById(id) {
    const data = this.#store.get(id);
    return data ? this.#toVideo(data) : null;
  }

  /**
   * Mengubah entry yang sudah ada. Tidak menambah entry baru.
   *
   * @param {Video} video
   * @returns {Video|null} null jika id belum ada
   */
  update(video) {
    const data = video.serialize();

    if (!this.#store.has(data.id)) {
      return null;
    }

    this.#store.set(data.id, data);
    return this.#toVideo(data);
  }

  /**
   * @param {string} id
   * @returns {Video|null} data yang dihapus, null jika id tidak ada
   */
  deleteById(id) {
    const data = this.#store.get(id);

    if (!data) {
      return null;
    }

    this.#store.delete(id);
    return this.#toVideo(data);
  }

  /**
   * Mengosongkan store. Dipakai untuk reset di test.
   */
  clear() {
    this.#store.clear();
  }
}

export const videoRepo = new VideoRepository();
