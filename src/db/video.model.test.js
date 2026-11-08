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