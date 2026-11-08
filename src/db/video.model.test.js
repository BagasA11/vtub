import { validate as isValidUuid, version as uuidVersion } from 'uuid';
import { Video } from "./video.model.mjs";

// deserialize
// valid response plain object payload -> non error
test('deserialize_plain',()=>{
    const input = {
        id:'1234',
        judul:'marsha and the bear',
        thumbnail:'marsha_n_bear.jpeg',
        mp4file:'eps_1.mp4'
    }
    expect(()=>{
        Video.deserialize(input);
    }).not.toThrow();
});

test('deserialize_json',()=>{
    const input = {
        id:'1234',
        judul:'marsha and the bear',
        thumbnail:'marsha_n_bear.jpeg',
        mp4file:'eps_1.mp4'
    };
    const inputJson = JSON.stringify(input);
    expect(()=>{
        Video.deserialize(inputJson);
    }).not.toThrow();
});

test('deserialize_thumbnail_null', ()=>{
    const input = {
        id:'1234',
        judul:'marsha n the bear',
        thumbnail: null,
        mp4file:'eps_1.mp4'
    };

    expect(()=>{
        Video.deserialize(input);
    }).not.toThrow();
});

const payloads = [
    {id:'1234',judul:null,thumbnail: null,mp4file:'eps_1.mp4'},
    {id:'1234',judul:'marsha episode 1',thumbnail: null,mp4file:null},
    {id:'1234',judul:null,thumbnail: null,mp4file:null},
];

test.each(payloads)('deserialize_null', (payload) => {
  expect(() => Video.deserialize(payload)).toThrow();
});

test('serialize', ()=>{
    const input = {
        id:'1234',judul:'marsha and the bear episode-1',
        thumbnail: null,mp4file:'eps_1.mp4'
    };
    const video = Video.deserialize(input);
    expect(video.serialize()).toEqual(input);
});

// generateId
test('generateId_mengembalikan_string', ()=>{
    expect(typeof Video.generateId()).toBe('string');
});

test('generateId_mengembalikan_uuid_v4_yang_valid', ()=>{
    const id = Video.generateId();

    expect(isValidUuid(id)).toBe(true);
    expect(uuidVersion(id)).toBe(4);
});

test('generateId_unik_setiap_pemanggilan', ()=>{
    const ids = new Set(Array.from({ length: 100 }, () => Video.generateId()));

    expect(ids.size).toBe(100);
});

// deserialize memanggil generateId
test('deserialize_membuat_id_jika_tidak_diberikan', ()=>{
    const video = Video.deserialize({
        judul:'marsha and the bear',
        mp4file:'eps_1.mp4'
    });

    expect(isValidUuid(video.id)).toBe(true);
    expect(uuidVersion(video.id)).toBe(4);
});

test('deserialize_membuat_id_jika_string_kosong', ()=>{
    const video = Video.deserialize({
        id:'   ',
        judul:'marsha and the bear',
        mp4file:'eps_1.mp4'
    });

    expect(isValidUuid(video.id)).toBe(true);
});

test('deserialize_mempertahankan_id_yang_diberikan', ()=>{
    const video = Video.deserialize({
        id:'1234',
        judul:'marsha and the bear',
        mp4file:'eps_1.mp4'
    });

    expect(video.id).toBe('1234');
});

test('deserialize_menghasilkan_id_berbeda_untuk_setiap_pemanggilan', ()=>{
    const first = Video.deserialize({ judul:'episode 1', mp4file:'eps_1.mp4' });
    const second = Video.deserialize({ judul:'episode 2', mp4file:'eps_2.mp4' });

    expect(first.id).not.toBe(second.id);
});