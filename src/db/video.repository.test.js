import { Video } from './video.model.js';
import { VideoRepository } from './video.repository.js';

const buatVideo = (overrides = {}) =>
  Video.deserialize({
    judul: 'marsha and the bear',
    thumbnail: 'marsha_n_bear.jpeg',
    mp4file: 'eps_1.mp4',
    ...overrides,
});

describe('VideoRepository', () => {
  let repo;

  beforeEach(() => {
    repo = new VideoRepository();
  });

  describe('save', () => {
    test('menyimpan video dan findById mengembalikannya', () => {
      const video = buatVideo();

      const saved = repo.save(video);

      expect(saved).toBeInstanceOf(Video);
      expect(repo.findById(video.id).serialize()).toEqual(video.serialize());
    });

    test('menimpa data lama jika id sama', () => {
      const video = buatVideo();
      repo.save(video);

      repo.save(Video.deserialize({ ...video.serialize(), judul: 'judul baru' }));

      expect(repo.findAll()).toHaveLength(1);
      expect(repo.findById(video.id).judul).toBe('judul baru');
    });

    test('tidak memindahkan posisi saat menimpa', () => {
      const pertama = buatVideo({ judul: 'pertama' });
      const kedua = buatVideo({ judul: 'kedua' });
      repo.save(pertama);
      repo.save(kedua);

      repo.save(Video.deserialize({ ...pertama.serialize(), judul: 'pertama diubah' }));

      expect(repo.findAll().map((video) => video.judul)).toEqual([
        'pertama diubah',
        'kedua',
      ]);
    });

    test('menolak argumen yang bukan Video', () => {
      expect(() => repo.save({ judul: 'x', mp4file: 'y' })).toThrow(TypeError);
    });
  });

  describe('findById', () => {
    test('mengembalikan null jika id tidak dikenal', () => {
      expect(repo.findById('tidak-ada')).toBeNull();
    });
  });

  describe('findAll', () => {
    test('mengembalikan array kosong', () => {
      expect(repo.findAll()).toEqual([]);
    });

    test('mengikuti urutan insertion', () => {
      const pertama = buatVideo({ judul: 'pertama' });
      const kedua = buatVideo({ judul: 'kedua' });
      const ketiga = buatVideo({ judul: 'ketiga' });
      repo.save(pertama);
      repo.save(kedua);
      repo.save(ketiga);

      expect(repo.findAll().map((video) => video.id)).toEqual([
        pertama.id,
        kedua.id,
        ketiga.id,
      ]);
    });
  });

  describe('update', () => {
    test('mengubah data video yang sudah ada', () => {
      const video = buatVideo();
      repo.save(video);

      const updated = repo.update(
        Video.deserialize({ ...video.serialize(), judul: 'judul diubah' }),
      );

      expect(updated).toBeInstanceOf(Video);
      expect(repo.findById(video.id).judul).toBe('judul diubah');
    });

    test('mengembalikan null dan tidak menambah data jika id tidak ada', () => {
      const updated = repo.update(buatVideo({ id: 'tidak-ada' }));

      expect(updated).toBeNull();
      expect(repo.findAll()).toEqual([]);
    });
  });

  describe('deleteById', () => {
    test('menghapus dan mengembalikan data terhapus', () => {
      const video = buatVideo();
      repo.save(video);

      const deleted = repo.deleteById(video.id);

      expect(deleted).toBeInstanceOf(Video);
      expect(deleted.serialize()).toEqual(video.serialize());
      expect(repo.findById(video.id)).toBeNull();
      expect(repo.findAll()).toEqual([]);
    });

    test('mengembalikan null jika id tidak ada', () => {
      expect(repo.deleteById('tidak-ada')).toBeNull();
    });
  });

  describe('clear', () => {
    test('mengosongkan store', () => {
      repo.save(buatVideo());
      repo.save(buatVideo());

      repo.clear();

      expect(repo.findAll()).toEqual([]);
    });
  });

  describe('isolasi data', () => {
    test('mutasi hasil findById tidak mengubah isi store', () => {
      const video = buatVideo();
      repo.save(video);

      const found = repo.findById(video.id);
      found.judul = 'diubah dari luar';

      expect(repo.findById(video.id).judul).toBe('marsha and the bear');
    });

    test('mutasi hasil findAll tidak mengubah isi store', () => {
      repo.save(buatVideo());

      const list = repo.findAll();
      list[0].judul = 'diubah dari luar';
      list.pop();

      expect(repo.findAll()).toHaveLength(1);
      expect(repo.findAll()[0].judul).toBe('marsha and the bear');
    });

    test('mutasi instance asli setelah save tidak mengubah isi store', () => {
      const video = buatVideo();
      repo.save(video);

      video.judul = 'diubah setelah save';

      expect(repo.findById(video.id).judul).toBe('marsha and the bear');
    });
  });
});
