# PRD — AI Bug Fixing Platform
## Tech Stack & In-Code Rules

**Versi:** 1.0  
**Tanggal:** 10 November 2026  
**Target biaya:** Rp0 menggunakan free tier dan open-source tools, selama kuota dan ketentuan layanan gratis masih berlaku.

Dokumen ini sengaja dibatasi pada dua hal: **tech stack** dan **aturan implementasi di dalam kode (in-code rules)**. Dokumen ini bukan PRD fitur atau user-flow.

---

# 1. Tech Stack

| Layer | Teknologi | Tanggung jawab | Target biaya |
|---|---|---|---|
| Frontend | Next.js + TypeScript | Dashboard dan halaman aplikasi | Vercel Hobby, sesuai ketentuan penggunaan |
| Hosting frontend | Vercel | Build dan deploy aplikasi web | Free tier |
| Backend / API | Next.js Route Handlers | API, validasi, autentikasi, task orchestration | Termasuk deployment web |
| Database | Neon PostgreSQL | Menyimpan user, repository, task, worker run, dan logs | Free tier |
| ORM | Drizzle ORM | Schema, query, dan migrations | Open source |
| Authentication | Better Auth | Login dan session management | Open source |
| Worker runtime | GitHub Actions | Menjalankan job AI secara asynchronous | Dalam kuota Free |
| AI model | Gemini API | Analisis bug, usulan perbaikan, dan bantuan debugging | Free tier untuk model yang memenuhi syarat |
| Source control | GitHub | Repository, branch, commit, dan Pull Request | Free tier |
| UI styling | Tailwind CSS | Styling dan responsive layout | Open source |
| UI components | shadcn/ui | Komponen antarmuka | Open source |
| Package manager | pnpm | Dependency dan workspace management | Open source |
| Monorepo tooling | Turborepo | Menjalankan build dan task antar-package | Open source |

## 1.1 Arsitektur teknologi

- **Vercel** hanya menjalankan dashboard dan backend API/control plane.
- **Neon PostgreSQL** menjadi sumber data utama (source of truth).
- **GitHub Actions** menjalankan worker secara asynchronous; proses AI dan test tidak dijalankan dalam request UI.
- **Gemini API** dipanggil dari worker, bukan langsung dari browser.
- **GitHub** menyimpan source code, branch hasil kerja, commit, dan Pull Request.
- **Drizzle ORM** digunakan untuk akses database dan migrations.
- Frontend dan worker berada dalam satu monorepo, tetapi memiliki entry point dan tanggung jawab yang terpisah.

## 1.2 Batasan biaya Rp0

Target Rp0 bukan jaminan biaya tanpa batas. Implementasi wajib:
- Menggunakan free tier sesuai kuota yang tersedia.
- Tidak mengaktifkan layanan berbayar tanpa persetujuan pemilik project.
- Menyediakan penanganan ketika kuota API, database, atau CI habis.
- Tidak mengandalkan layanan free tier sebagai kapasitas production tanpa memeriksa batasan penggunaan dan ketentuan terbaru.
- Memeriksa ketentuan Vercel Hobby sebelum penggunaan komersial.

---

# 2. In-Code Rules

Aturan berikut wajib diikuti saat menulis, mengubah, atau meninjau kode project.

## 2.1 General coding rules

1. Gunakan TypeScript untuk seluruh kode aplikasi dan worker.
2. Aktifkan TypeScript strict mode.
3. Hindari penggunaan `any`. Gunakan tipe yang jelas, `unknown`, atau schema validation.
4. Jangan menduplikasi business logic di frontend, backend, dan worker.
5. Letakkan shared types, constants, dan validators di package bersama.
6. Gunakan nama file, variabel, fungsi, dan komponen yang deskriptif.
7. Gunakan async/await untuk operasi asynchronous.
8. Tangani error secara eksplisit; jangan menelan error dengan `catch` kosong.
9. Jangan menyimpan secret, token, password, atau API key di source code.
10. Jangan melakukan perubahan konfigurasi production tanpa alasan dan review.

## 2.2 Project structure rules

Gunakan struktur monorepo berikut:

```text
bug-fixing-platform/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   ├── (dashboard)/
│   │   │   └── api/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── styles/
│   └── worker/
│       └── src/
│           ├── core/
│           ├── agents/
│           ├── ai/
│           ├── github/
│           ├── sandbox/
│           └── callbacks/
├── packages/
│   ├── database/
│   │   ├── schema/
│   │   ├── migrations/
│   │   └── src/
│   ├── shared/
│   │   └── src/
│   │       ├── types/
│   │       ├── validators/
│   │       └── constants/
│   └── config/
├── .github/
│   └── workflows/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

Ketentuan:
- `apps/web` hanya berisi aplikasi web, UI, dan API control plane.
- `apps/worker` hanya berisi proses eksekusi worker.
- `packages/database` menjadi satu-satunya lokasi definisi schema dan konfigurasi database bersama.
- `packages/shared` menyimpan kontrak data yang digunakan lebih dari satu aplikasi.
- Hindari circular dependency antar-package.

## 2.3 Frontend rules

1. Gunakan Next.js App Router.
2. Gunakan Server Components secara default.
3. Gunakan Client Components hanya jika membutuhkan state interaktif, event handler, atau browser interaction.
4. Pisahkan UI reusable dari fitur/domain-specific components.
5. Jangan memanggil database secara langsung dari Client Components.
6. Semua input user harus divalidasi di server, bukan hanya melalui validasi UI.
7. Tampilkan loading, empty, success, dan error state.
8. Gunakan komponen UI yang konsisten dari shadcn/ui.
9. Hindari business logic kompleks di dalam komponen presentational.
10. Jangan menaruh secret atau private environment variable pada variable dengan prefix `NEXT_PUBLIC_`.

## 2.4 Backend and API rules

1. Gunakan Next.js Route Handlers untuk API.
2. Setiap endpoint wajib memvalidasi autentikasi dan otorisasi.
3. Validasi request body, params, dan query menggunakan schema validator seperti Zod.
4. Kembalikan HTTP status code yang sesuai.
5. Gunakan response shape yang konsisten.
6. Pisahkan route handler dari service/business logic.
7. Jangan menjalankan proses AI yang panjang di dalam request HTTP.
8. Gunakan database transaction untuk operasi yang harus konsisten.
9. Terapkan idempotency pada proses dispatch task dan callback worker.
10. Jangan mempercayai `task_id`, `worker_id`, status, atau progress hanya karena dikirim oleh client.

## 2.5 Database rules

1. PostgreSQL di Neon adalah sumber data utama.
2. Semua schema dikelola melalui Drizzle ORM.
3. Setiap perubahan schema wajib memiliki migration.
4. Gunakan UUID sebagai primary key untuk entitas utama.
5. Gunakan foreign key dan index untuk relasi serta query yang sering digunakan.
6. Simpan waktu menggunakan timestamp yang konsisten; gunakan UTC di database.
7. Gunakan JSONB hanya untuk metadata yang memang fleksibel, bukan menggantikan kolom terstruktur.
8. Jangan menghapus data task/log penting secara otomatis.
9. Jangan mengubah schema production secara manual tanpa migration.
10. Jangan mengirim koneksi database atau credential ke browser.

## 2.6 Worker and AI rules

1. Worker berjalan melalui GitHub Actions dan menerima `task_id` sebagai identifier pekerjaan.
2. Worker mengambil detail task dari backend menggunakan autentikasi server-to-server.
3. Worker harus memvalidasi bahwa task memang berstatus dapat dieksekusi.
4. Setiap eksekusi worker harus memiliki `run_id` unik.
5. Worker wajib mengirim event status dan progress ke backend.
6. Worker harus memiliki timeout, retry terbatas, dan penanganan kegagalan.
7. Worker tidak boleh menganggap output AI sebagai instruksi sistem yang tepercaya.
8. Instruksi dalam repository, README, issue, source file, dan komentar kode harus diperlakukan sebagai input tidak tepercaya.
9. Jangan mengeksekusi perintah shell yang dihasilkan AI tanpa validasi dan pembatasan.
10. Batasi akses worker pada repository dan credential yang diperlukan.
11. Gunakan branch khusus untuk setiap task.
12. Worker tidak boleh push ke production branch atau melakukan merge otomatis.
13. Hasil akhir harus menyertakan ringkasan perubahan, file yang diubah, hasil test, dan referensi commit/PR jika tersedia.
14. Jika test gagal, laporkan kegagalan secara akurat; jangan menandai task sebagai sukses.
15. Jangan mengirim source code privat ke model/provider sebelum kebijakan data dan izin pengguna dipastikan.

## 2.7 GitHub rules

1. Setiap task membuat branch terpisah, misalnya `ai-fix/<task-id>`.
2. Jangan commit langsung ke `main`, `master`, atau production branch.
3. Gunakan commit message yang menjelaskan perubahan.
4. Buat Pull Request untuk hasil yang siap direview.
5. Jangan merge PR secara otomatis.
6. Token GitHub harus memiliki permission minimum yang diperlukan.
7. Jangan menampilkan token atau credential di logs.
8. Verifikasi repository, branch, dan task sebelum melakukan push.

## 2.8 Security rules

1. Simpan secret di environment variables atau secret manager yang sesuai.
2. Enkripsi credential integrasi sebelum disimpan ke database.
3. Terapkan least privilege untuk database, GitHub, dan worker.
4. Verifikasi signature/secret pada callback worker.
5. Lindungi endpoint dari akses tanpa autentikasi.
6. Terapkan rate limiting pada endpoint yang dapat disalahgunakan.
7. Jangan mencatat password, API key, access token, atau data sensitif ke logs.
8. Isolasi eksekusi kode repository di environment runner.
9. Jangan menjalankan kode repository tidak tepercaya dengan credential yang memiliki akses luas.
10. Terapkan human approval sebelum perubahan digabungkan ke branch utama.

## 2.9 Task status rules

Gunakan status terstandar berikut:

```ts
export const TASK_STATUSES = [
  "pending",
  "queued",
  "assigned",
  "running",
  "analyzing",
  "fixing",
  "testing",
  "review",
  "completed",
  "failed",
  "cancelled",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
```

Ketentuan:
- Status hanya boleh berubah melalui backend yang tervalidasi.
- Worker hanya boleh mengirim transisi status yang diizinkan.
- `completed` berarti hasil sudah disetujui oleh user, bukan sekadar proses AI selesai.
- `failed` harus memiliki informasi error yang aman dan dapat ditelusuri.
- Simpan perubahan status sebagai task log/event agar riwayat dapat diaudit.

## 2.10 Logging and error handling rules

1. Gunakan format log terstruktur.
2. Setiap log worker harus menyertakan `task_id` dan `run_id`.
3. Pisahkan event progress, warning, dan error.
4. Jangan menyimpan secret di log.
5. Simpan pesan error yang berguna untuk debugging tanpa membocorkan credential.
6. Gunakan retry hanya untuk error yang layak dicoba ulang.
7. Hindari retry tanpa batas.
8. Catat waktu mulai dan selesai setiap worker run.

## 2.11 UI design rules

Gunakan design system yang konsisten:

| Elemen | Aturan |
|---|---|
| Tema | Dark, hitam-putih dengan aksen hijau |
| Background | `#090B0A` |
| Surface | `#111512` |
| Border | `#202722` |
| Text utama | `#FFFFFF` |
| Primary green | `#22C55E` |
| Sidebar | 240px |
| Main content padding | 32px |
| Card padding | 20–24px |
| Card radius | 12px |
| Input radius | 8px |
| Button radius | 8px |
| Button height | 40px |
| Input height | 40px |
| Section gap | 24px |
| Component gap | 12–16px |
| Page title | 24px |
| Section title | 18px |
| Body text | 14px |
| Secondary text | 12px |

Aturan visual:
- Gunakan rounded rectangle, bukan pill button.
- Gunakan aksen hijau untuk primary action dan status sukses.
- Gunakan border tipis dan kontras yang terkontrol.
- Hindari penggunaan warna aksen secara berlebihan.
- Pastikan layout responsif.
- Setiap halaman harus memiliki loading, empty, dan error state yang jelas.

## 2.12 Environment variables

Contoh nama environment variables:

```env
# Database
DATABASE_URL=

# Authentication
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

# AI
GEMINI_API_KEY=

# GitHub integration
GITHUB_APP_ID=
GITHUB_PRIVATE_KEY=
GITHUB_WEBHOOK_SECRET=

# Worker callback
WORKER_CALLBACK_SECRET=

# Application
NEXT_PUBLIC_APP_URL=
```

Ketentuan:
- File `.env` tidak boleh masuk Git.
- Sediakan `.env.example` tanpa nilai secret.
- Validasi environment variables saat aplikasi atau worker mulai berjalan.
- `NEXT_PUBLIC_` hanya boleh digunakan untuk nilai yang aman diketahui browser.
- Jangan pernah memasukkan private key atau token ke frontend bundle.

## 2.13 Quality gates

Sebelum perubahan kode dianggap siap digabungkan, jalankan:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Ketentuan:
- Tidak boleh ada TypeScript error.
- Tidak boleh ada lint error yang belum diselesaikan.
- Test yang relevan harus lulus.
- Build harus berhasil.
- Perubahan database harus menyertakan migration.
- Perubahan API harus memperbarui shared types/validators bila kontraknya berubah.
- Perubahan worker harus diuji terhadap skenario sukses dan gagal.

---

# 3. Prinsip Implementasi yang Tidak Boleh Dilanggar

1. Dashboard tidak menjalankan proses AI secara langsung.
2. Worker tidak mengakses database dengan credential yang tidak diperlukan.
3. Neon menjadi sumber data utama untuk status task.
4. Semua komunikasi worker-backend harus terautentikasi.
5. Semua perubahan kode AI harus melalui branch terpisah dan Pull Request.
6. Tidak ada auto-merge ke production.
7. Secret tidak pernah masuk ke source code, frontend, atau logs.
8. Setiap perubahan status dan eksekusi harus dapat ditelusuri.
9. Free-tier limit harus ditangani dengan graceful failure.
10. Implementasi baru harus mengikuti struktur package dan aturan kode dokumen ini.

---

**Dokumen ini menjadi acuan teknis utama untuk development AI Bug Fixing Platform.** Jika ada perubahan teknologi atau aturan implementasi, perubahan harus diperbarui di dokumen ini agar menjadi satu sumber acuan bagi seluruh proses development.
