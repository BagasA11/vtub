import { VideoCreateDto } from './video.dto.mjs';

describe('VideoCreateDto.from', () => {
  test('membuat dto dari payload valid', () => {
    const dto = VideoCreateDto.from({
      judul: 'marsha and the bear',
      thumbnail: 'marsha_n_bear.jpeg',
      mp4file: 'eps_1.mp4',
    });

    expect(dto).toBeInstanceOf(VideoCreateDto);
    expect(dto.judul).toBe('marsha and the bear');
    expect(dto.thumbnail).toBe('marsha_n_bear.jpeg');
    expect(dto.mp4file).toBe('eps_1.mp4');
  });

  test('thumbnail default null jika tidak diberikan', () => {
    const dto = VideoCreateDto.from({
      judul: 'marsha and the bear',
      mp4file: 'eps_1.mp4',
    });

    expect(dto.thumbnail).toBeNull();
  });

  test('thumbnail null diizinkan', () => {
    const dto = VideoCreateDto.from({
      judul: 'marsha and the bear',
      thumbnail: null,
      mp4file: 'eps_1.mp4',
    });

    expect(dto.thumbnail).toBeNull();
  });

  test('hanya menyimpan field yang dikenal', () => {
    const dto = VideoCreateDto.from({
      id: '1234',
      judul: 'marsha and the bear',
      thumbnail: 'marsha_n_bear.jpeg',
      mp4file: 'eps_1.mp4',
      extra: 'diabaikan',
    });

    expect(dto).toEqual({
      judul: 'marsha and the bear',
      thumbnail: 'marsha_n_bear.jpeg',
      mp4file: 'eps_1.mp4',
    });
  });
});

const invalidPayloads = [
  undefined,
  null,
  'bukan object',
  123,
  [],
  {},
  { mp4file: 'eps_1.mp4' },
  { judul: '', mp4file: 'eps_1.mp4' },
  { judul: '   ', mp4file: 'eps_1.mp4' },
  { judul: 123, mp4file: 'eps_1.mp4' },
  { judul: 'marsha and the bear' },
  { judul: 'marsha and the bear', mp4file: '' },
  { judul: 'marsha and the bear', mp4file: '   ' },
  { judul: 'marsha and the bear', mp4file: null },
  { judul: 'marsha and the bear', mp4file: 123 },
  { judul: 'marsha and the bear', mp4file: 'eps_1.mp4', thumbnail: 123 },
  { judul: 'marsha and the bear', mp4file: 'eps_1.mp4', thumbnail: {} },
];

test.each(invalidPayloads)('menolak payload tidak valid: %p', (payload) => {
  expect(() => VideoCreateDto.from(payload)).toThrow(TypeError);
});
