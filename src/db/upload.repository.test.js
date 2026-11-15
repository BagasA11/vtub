import { v4 as uuidv4 } from "uuid";
import { Upload } from "./upload.model.js";
import { UploadRepository } from "./upload.repository.js";
import { MP4_MIME, JPG_MIME, PNG_MIME } from "../dto/upload.dto.js";
import { ttl2Millis } from "./upload.repository.js";
import { jest } from '@jest/globals';

const buatPayload = (overrides = {}) =>
  Upload.deserialize({
    id: uuidv4(),
    kind:'video',
    mime:MP4_MIME,
    size: 2400,
    ...overrides,
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('UploadRepository', ()=>{
   let repo;
   beforeEach(()=>{
        repo = new UploadRepository();
    }); 

   test('setiap save harus return Upload instance', ()=>{
      const input = Upload.deserialize(buatPayload());
      const output = repo.save(input);

      expect(output).toBeInstanceOf(Upload);
      expect(output.id).toEqual(input.id);
      expect(repo.findById(input.id)).toEqual(output);
    });

    test('save dengan id sama harus overwrite', ()=>{
        const id = uuidv4();
        const payload = {
          id:id, kind:'thumbnail', mime:PNG_MIME, size:1200
        };

        let p1 = Upload.deserialize(payload);
        repo.save(p1);
        const p2 = buatPayload({id:id, mime:JPG_MIME});
        repo.save(p2);

        expect(repo.findAll()).toHaveLength(1);
        expect(repo.findById(p1.id).mime).toBe(JPG_MIME);
        expect(repo.findById(p1.id).size).toEqual(2400);
    });

    test('mengembalikan null jika id tidak dikenal', () => {
      expect(repo.findById('tidak-ada')).toBeNull();
    });

    test('findAll mengembalikan array kosong saat belum ada data', () => {
      expect(repo.findAll()).toEqual([]);
    });

    test('mengikuti urutan insertion', () => {
      const pertama = buatPayload({ mime: JPG_MIME, kind:'thumbnail' });
      const kedua = buatPayload({ mime: PNG_MIME, kind:'thumbnail' });
      const ketiga = buatPayload({ mime: MP4_MIME });

      repo.save(pertama);
      repo.save(kedua);
      repo.save(ketiga);

      expect(repo.findAll().map((registry) => registry.id)).toEqual([
        pertama.id,
        kedua.id,
        ketiga.id,
      ]);
    });

    test('clear harus mereset array menjadi kosong', ()=>{
      const data = [
          buatPayload(),buatPayload(),
          buatPayload()
      ];
      data.forEach((item)=>{
          repo.save(item);
      });
      repo.clear();

      expect(repo.findAll()).toHaveLength(0);
    });


});

describe('uji find expired', ()=>{
  const isPending = (status)=> {return status.toLowerCase() == 'pending'};
  const meetDeadline = (createdAt, ttl) => {
    const now = Math.floor(Date.now() / 1000);
    const ttlMillis = ttl2Millis(ttl);
    return 1000 * (now - createdAt) >= ttlMillis;
  };
  
  let repo, createdAt;
  beforeEach(()=>{
    repo = new UploadRepository();

    jest.useFakeTimers(); // Gunakan vi.useFakeTimers() jika memakai Vitest
    jest.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    createdAt = Math.floor(Date.now() / 1000);

    const datasets = [
      buatPayload({createdAt:createdAt}), buatPayload({createdAt:createdAt}), 
      buatPayload({createdAt:createdAt}),
      buatPayload(), buatPayload()
    ];
    datasets.forEach((item)=>{repo.save(item);});
    repo.consumed(datasets[3].id);
    repo.consumed(datasets[4].id);
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });

  test('must have lenght 3', ()=>{
    jest.advanceTimersByTime(4000);
    
    const expectedLength = 3;
    const expireds = repo.findExpired(); 
    expect(expireds).toHaveLength(expectedLength);
  });

  test('must have pending status & lebih dari ttl', ()=>{
    // Majukan waktu melewati TTL
    jest.advanceTimersByTime(4000);
    const expireds = repo.findExpired();

    const pass = expireds.filter(item => isPending(item.status) &&
      meetDeadline(item.createdAt, repo.getTTL()));

    expect(pass).toHaveLength(expireds.length);
    expect(pass).toEqual(expireds);
  });

  test('expired tidak boleh mengambil data yang baru diinsert', ()=>{
    jest.advanceTimersByTime(4000);
    
    const data = buatPayload();
    const saved = repo.save(data);
    jest.advanceTimersByTime(2000);
    
    const expireds = repo.findExpired();
    expect(expireds.map((el) => el.id)).not.toContain(saved.id);
  });

});
