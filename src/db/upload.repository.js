import { Upload } from "./upload.model.js";

/**
 * Membuat durasi TTL.
 *
 * @param {number} hours
 * @param {number} minutes
 * @param {number} seconds
 * @returns {{ hours: number, minutes: number, seconds: number }}
 */
export const ttlDuration = (hours=0, minutes=0, seconds=3) => {
    return {
        hours:hours,
        minutes:minutes,
        seconds:seconds
    };
};

export class UploadRepository {
    #store = new Map();

    constructor(duration = ttlDuration()) {
        this.ttl = duration;
    }

    #toUpload(data) {
        return Upload.deserialize({ ...data });
    }

    /**
     *
     * @param {Upload} upload
     * @returns {Upload}
     * overwrite jika ada id yang sama
     */
    save(upload) {
        const data = upload.serialize();
        this.#store.set(data.id, data);
        return this.#toUpload(data);
    }

    /**
     *
     * @param {number} now Unix detik
     * @returns {Upload[]}
     * find upload registry that has pending status exceed ttl
     *
     * return list Array of upload instance
     */
    findExpired(now = Math.floor(Date.now() / 1000)) {
        const ttlMillis = this.ttl2Millis();

        return Array.from(this.#store.values())
            .filter((data) => data.status === 'PENDING'
                && now * 1000 - data.createdAt * 1000 >= ttlMillis)
            .map((data) => this.#toUpload(data));
    }

    /**
     * @param {string} id
     * @returns {Upload | null}
     * find upload registry instance, or null if not exists
     */
    findById(id) {
        const data = this.#store.get(id);
        return data ? this.#toUpload(data) : null;
    }

    /**
     * @returns {Upload[]}
     */
    findAll() {
        return Array.from(this.#store.values(), (data) => this.#toUpload(data));
    }

    /**
     *
     * @param {string} id
     * @returns {Upload | null} null jika id tidak ada
     * wrapper method for Upload.consume()
     * set status instance from pending to consumed
     */
    consumed(id) {
        const upload = this.findById(id);

        if (!upload) {
            return null;
        }

        return this.save(upload.consume());
    }

    /**
     * @param {string} id
     * @returns {Upload | null} data yang dihapus, null jika id tidak ada
     */
    remove(id) {
        const data = this.#store.get(id);

        if (!data) {
            return null;
        }

        this.#store.delete(id);
        return this.#toUpload(data);
    }

    clear() {
        this.#store.clear();
    }

    /**
     * @returns {number} TTL dalam milidetik
     */
    ttl2Millis() {
        const { hours = 0, minutes = 0, seconds = 0 } = this.ttl;
        return ((hours * 60 + minutes) * 60 + seconds) * 1000;
    }

}

// production/development: 1 hari
export const uploadRepo = new UploadRepository(ttlDuration(24));
