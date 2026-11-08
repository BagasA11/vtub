import { Video } from "../db/video.model.js";
import { videoRepo } from "../db/video.repository.js";
import { VideoCreateDto } from "../dto/video.dto.js";
import { VideoValidationError } from "../errors/app.error.js";

export class VideoService {
    constructor(repo = videoRepo){
        this.repo = repo;
    }
    
    /**
     * Membuat video baru dari payload mentah.
     *
     * Payload divalidasi oleh VideoCreateDto, lalu diubah menjadi Video dan
     * disimpan ke repository. TypeError dari validasi dipetakan menjadi
     * VideoValidationError agar konsisten di layer HTTP.
     *
     * @param {object} data
     * @return {Video}
     * @throws {VideoValidationError} jika payload tidak valid
     */
    create(data) {
        try {
            const dto = VideoCreateDto.from(data);
            const video = Video.deserialize(dto);
            return this.repo.save(video);
        } catch (error) {
            if (error instanceof TypeError) {
                throw new VideoValidationError(error.message);
            }

            throw error;
        }
    }
    
    /**
     * Mengemablikan list array video meskipun list kosong
     * 
     * @returns {Video[]}
     */
    list() {
        return this.repo.findAll();
    }
    
    /**
     * 
     * @param {*} id
     * @return {Video|null} jika tidak ditemukan
     */
    findByID(id) {}
    
    /**
     * Menghapus instance berdasarkan id
     * @param id   
     */
    delete(id) {}
}