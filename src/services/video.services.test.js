import { VideoService } from "./video.services.js";
import { Video } from "../db/video.model.js";
import { VideoCreateDto } from "../dto/video.dto.js";
import { VideoValidationError } from "../errors/app.error.js";
import { VideoRepository } from "../db/video.repository.js";

const createPayload = (overrides = {}) =>
  VideoCreateDto.from({
    judul: 'marsha and the bear',
    thumbnail: 'marsha_n_bear.jpeg',
    mp4file: 'eps_1.mp4',
    ...overrides,
});

describe('create video', ()=>{
    // test('create dto tidak throw', ()=>{
    //     const payload = createPayload();
    //     expect(()=>{
    //         VideoCreateDto.from(payload);
    //     }).not.toThrow();
    // }); 

    // test('konversi ke video tidak throw', ()=>{
    //     const payload = createPayload();
    //     const dto = VideoCreateDto.from(payload);
    //     expect(()=>{
    //         Video.deserialize(dto);
    //     }).not.toThrow();
    // });

    test('return value harus instance video', ()=>{
        const payload = createPayload();
        const service = new VideoService(new VideoRepository());

        expect(service.create(payload)).toBeInstanceOf(Video);
    });
    
    test('invalid input harus invalid', ()=>{
        const service = new VideoService(new VideoRepository());
        expect(()=>{
            service.create({ judul: '', mp4file: 'eps_1.mp4' });
        }).toThrow(VideoValidationError);
    });
});