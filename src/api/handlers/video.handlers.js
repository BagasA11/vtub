// import { VideoService } from "../../services/video.services.js";
import { service } from "../../services/video.services.js";
import { NotFoundError, VideoValidationError } from "../../errors/app.error.js";
import { VideoCreateResponseDto } from "../../dto/video.dto.js";
import {
    HTTP_BAD_REQUEST,
    HTTP_CREATED,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_FOUND,
    HTTP_OK,
} from "./statuscode.js";

export class VideoHandler {
    constructor(svc = service) {
        this.service = svc;
    }
    
    index = (req, res) => {
        return res.sendStatus(200);
    }

    /**
     * handler create video
     * @returns {object} mengirim data json jika berhasil | validation error | internal server error 
     */
    create = async (req,res)=>{
        try {
            const video = this.service.create(req.body);

            return res
                .status(HTTP_CREATED)
                .json(VideoCreateResponseDto(
                    HTTP_CREATED,
                    'Video berhasil dibuat',
                    video,
                ));
        } catch (error) {
            if (error instanceof VideoValidationError) {
                return res
                    .status(HTTP_BAD_REQUEST)
                    .json({
                        ...VideoCreateResponseDto(
                            HTTP_BAD_REQUEST,
                            error.message,
                            null,
                        ),
                        field: error.errorField ?? null,
                    });
            }

            return res
                .status(HTTP_INTERNAL_SERVER_ERROR)
                .json(VideoCreateResponseDto(
                    HTTP_INTERNAL_SERVER_ERROR,
                    'Terjadi kesalahan pada server',
                    null,
                ));
        }
    };

    /**
     * handler list video
     * mengirim seluruh data video 
     * @return {Video[]} data
     */
    list = async (req, res) => {
        const data = this.service.list();
        return res.status(HTTP_OK).json(VideoCreateResponseDto(
            HTTP_OK, "success", data
        ));
    };

    /**
     * handler detail video
     * @returns {object} video dalam envelope data | not found | internal server error
     */
    findByID = async (req, res) => {
        try {
            const video = this.service.findByID(req.params.videoId);

            return res
                .status(HTTP_OK)
                .json(VideoCreateResponseDto(HTTP_OK, 'success', video));
        } catch (error) {
            if (error instanceof NotFoundError) {
                return res
                    .status(HTTP_NOT_FOUND)
                    .json(VideoCreateResponseDto(
                        HTTP_NOT_FOUND,
                        error.message,
                        null,
                    ));
            }

            return res
                .status(HTTP_INTERNAL_SERVER_ERROR)
                .json(VideoCreateResponseDto(
                    HTTP_INTERNAL_SERVER_ERROR,
                    'Terjadi kesalahan pada server',
                    null,
                ));
        }
    };

    /**
     * handler hapus video
     * @returns {object} video yang dihapus dalam envelope data | not found | internal server error
     */
    delete = async (req, res) => {
        try {
            const video = this.service.delete(req.params.videoId);

            return res
                .status(HTTP_OK)
                .json(VideoCreateResponseDto(
                    HTTP_OK,
                    'Video berhasil dihapus',
                    video,
                ));
        } catch (error) {
            if (error instanceof NotFoundError) {
                return res
                    .status(HTTP_NOT_FOUND)
                    .json(VideoCreateResponseDto(
                        HTTP_NOT_FOUND,
                        error.message,
                        null,
                    ));
            }

            return res
                .status(HTTP_INTERNAL_SERVER_ERROR)
                .json(VideoCreateResponseDto(
                    HTTP_INTERNAL_SERVER_ERROR,
                    'Terjadi kesalahan pada server',
                    null,
                ));
        }
    };
}

export const createHandler = new VideoHandler();