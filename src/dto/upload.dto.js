export const UploadResponseDto = (uuid, mime, size) => {
    return {
        uuid:uuid,
        mime:mime,
        size:size
    };
};

/**
 * constants mime for image type
 */
export const JPG_MIME = 'image/jpeg';
export const PNG_MIME = 'image/png';
/**
 * constants mime for video type
 */
export const MP4_MIME = 'video/mp4';

export const STATUS_PENDING = 'PENDING';
export const STATUS_CONSUMED = 'CONSUMED';

