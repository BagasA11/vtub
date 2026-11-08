# AGENTS.md

## Overview
Aplikasi ini merupakan api pemutar video. Ketika menerima request upload, file video dipindahkan ke folder, lalu judul dan nama file video disimpan ke dalam variabel sebagai pasangan key value

## Current state
- Node.js + Express API; `express` dan `jest` sudah terpasang.
- Belum ada kode aplikasi; `/src` baru berisi smoke test setup Jest.
- `main` menunjuk ke `index.js`, tetapi file tersebut belum ada.

## Working here
- Gunakan native ES Module (`"type": "module"`). Import relatif wajib menyertakan ekstensi `.js`.
- Ikuti TDD: tulis test yang gagal terlebih dahulu, lalu implementasi. Gunakan `npm run test:watch` saat iterasi.
- Jest berjalan dengan `--experimental-vm-modules`; warning ExperimentalWarning dari Node adalah normal.
- Untuk mock di ESM, gunakan `jest.unstable_mockModule()` lalu `await import()`. `jest.mock()` tidak bekerja pada native ESM.

## Commands

- Test: `npm test`
- Test (single file): `npm test -- src/path/to/file.test.js`
- Test watch (TDD): `npm run test:watch`
- Coverage: `npm run test:coverage`
- Build, lint, format, dan type check belum dikonfigurasi.

## Code Style

- Gunakan gaya ES Module untuk import module
- Gunakan `const` secara default. `let` hanya untuk nilai yang dapat re-assign

## Architecture
- `/src` source code aplikasi
- `/src/api` Http handlers (no business logic)
- `/src/services` Business logic
- `/src/db` Skema Database (sementara menggunakan variabel dulu)
- `/src/dto` struktur request dan respon (jika perlu)
- `/src/**/*.test.js` unit test, diletakkan di samping kode yang diuji; Jest hanya memindai `/src`
- `/files` menampung file video

## Stacks
- express js
- javascript
- test runner jest
- linter eslint

# Rules
- Ketika diminta membuat scaffold, cukup buatkan scafforld (nama class atau fungsi) saja, begitu pula dengan pembuatan test case.