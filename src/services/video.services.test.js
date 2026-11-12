import { VideoService } from "./video.services.js";
import { Video } from "../db/video.model.js";
import { VideoCreateDto } from "../dto/video.dto.js";
import { VideoValidationError } from "../errors/app.error.js";
import { VideoRepository } from "../db/video.repository.js";
import { NotFoundError } from "../errors/app.error.js";

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
    let svc;
    beforeEach(()=>{
        svc = new VideoService(new VideoRepository());
    });

    test('return value harus instance video', ()=>{
        const payload = createPayload();

        expect(svc.create(payload)).toBeInstanceOf(Video);
    });
    
    test('invalid input harus invalid', ()=>{
        expect(()=>{
            svc.create({ judul: '', mp4file: 'eps_1.mp4' });
        }).toThrow(VideoValidationError);
    });
});

describe('find by id', ()=>{
    let svc;
    beforeEach(()=>{
        svc = new VideoService(new VideoRepository());
    });

    test('throw not found error jika tidak ditemukan', ()=>{
        expect(()=>{
            svc.findByID('12345');
        }).toThrow(NotFoundError);
    });

    test('data yang diperoleh harus identik dengan payload', ()=>{
        const payload = createPayload();
        const video = svc.create(payload);
        const data = svc.findByID(video.id);
        expect(data.serialize()).toMatchObject(payload);
    });
});

describe('video data deletion', ()=>{
    let svc;
    beforeEach(()=>{
        svc = new VideoService(new VideoRepository());
    });

    test('throw not found error jika tidak ditemukan', ()=>{
        expect(()=>{
            svc.delete('1234');
        }).toThrow(NotFoundError);
    });
    
    test('jumlah data harus tersisa 1 dan data yang tersisa adalah v2', () => {
        const payload_1 = createPayload();
        const payload_2 = createPayload();

        const v1 = svc.create(payload_1);
        const v2 = svc.create(payload_2); // Simpan instance v2

        svc.delete(v1.id);

        const data = svc.list();

        // 1. Memastikan ukuran array tersisa 1
        expect(data).toHaveLength(1);

        // 2. Memastikan data yang tersisa adalah v2 (v1 benar-benar terhapus)
        expect(data[0].id).toBe(v2.id);
    });

});