import { VideoService } from "../../services/video.services.js";
import { NotFoundError } from "../../errors/app.error.js";
import { VideoValidationError } from "../../errors/app.error.js";
import { VideoCreateDto, VideoCreateResponseDto } from "../../dto/video.dto.js";
import {
    HTTP_BAD_REQUEST,
    HTTP_CREATED,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_OK,
} from "./statuscode.js";

export class VideoHandler {
    constructor(svc = new VideoService()) {
        this.service = svc;
    }
    
    index = (req, res) => {
        return res.status(200);
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
}