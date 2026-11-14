import { v4 as uuidv4 } from "uuid";


/**
 * Model registry file upload.
 *
 * Field:
 * - id       : string file -> dapat dipakai untuk mencari path
 * - kind    : judul file {gambar/video}
 * - mime: mime type
 * - size  : ukuran file
 * - createdAt : timestamp file dibuat
 * - status: PENDING/CONSUMED
 * NOTE: setting ukuran max ada di layer repository atau service
 */
export class Upload {
    constructor({ id, kind, mime, size, createdAt, status } = {}) {
        this.id = typeof id === 'string' && id.trim() !== ''
            ? id
            : Upload.generateId();
        this.kind = kind;
        this.mime = mime;
        this.size = size;
        this.status = status ?? 'PENDING';
        this.createdAt = createdAt ?? Math.round(Date.now() / 1000);
    }

    static generateId() {
        return uuidv4();
    }

    /**
     * Mengubah plain object atau string JSON menjadi instance Upload.
     *
     * @param {object|string} input
     * @returns {Upload}
     */
    static deserialize(input) {
        const data = typeof input === 'string' ? JSON.parse(input) : input;

        if (data === null || typeof data !== 'object' || Array.isArray(data)) {
            throw new TypeError(
                'Upload.deserialize: input harus plain object atau string JSON',
            );
        }

        return new Upload(data);
    }

    /**
     * Menandai upload sebagai CONSUMED.
     *
     * Transisi hanya boleh dari PENDING, dipanggil setelah metadata video
     * berhasil disimpan dan file tidak lagi yatim.
     *
     * @returns {Upload} instance ini
     * @throws {TypeError} jika status bukan PENDING
     */
    consume() {
        if (this.status !== 'PENDING') {
            throw new TypeError(
                'Upload.consume: hanya upload berstatus PENDING yang dapat di-consume',
            );
        }

        this.status = 'CONSUMED';
        return this;
    }

    serialize() {
        return {
            id: this.id,
            kind: this.kind,
            mime: this.mime,
            size:this.size, 
            status: this.status,
            createdAt: this.createdAt
        };
    }

    toJSON() {
        return this.serialize();
    }
}
