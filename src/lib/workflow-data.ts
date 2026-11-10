export interface WorkflowStep {
  id: string;
  order: number;
  title: string;
  description: string;
  agentRole: string;
  estimatedDuration: string;
  requiredTools: string[];
  systemGuidance: string;
  requiresHumanReview: boolean;
  outputArtifact: string;
}

export interface JobWorkflow {
  id: string;
  name: string;
  category: string;
  description: string;
  badge: string;
  iconName: string;
  isCustom: boolean;
  defaultModel: string;
  maxAutonomousSteps: number;
  autoTriggerOnOrder: boolean;
  systemPromptTemplate: string;
  steps: WorkflowStep[];
  updatedAt: string;
}

export const DEFAULT_WORKFLOWS: JobWorkflow[] = [
  {
    id: "fixing-bug",
    name: "Fixing Bug",
    category: "Maintenance & Debugging",
    description:
      "Pipeline sistematis perbaikan bug dari error stack trace, pembuatan fail-first reproduction test, penulisan patch minimal tanpa side-effect, hingga verifikasi regresi dan pembuatan PR.",
    badge: "Core Workflow",
    iconName: "Bug",
    isCustom: false,
    defaultModel: "Gemini 2.5 Pro (Deep Reason)",
    maxAutonomousSteps: 8,
    autoTriggerOnOrder: true,
    systemPromptTemplate:
      "Anda adalah Senior AI Debugging Specialist. Fokus utama Anda adalah menganalisis root cause bug tanpa merusak kode existing. Buat pengujian yang gagal (reproduce), lakukan perbaikan sesederhana mungkin (minimal patch), jalankan regression test, dan dokumentasikan hasil secara terperinci.",
    updatedAt: "2026-11-10T20:00:00Z",
    steps: [
      {
        id: "step-fb-1",
        order: 1,
        title: "Reproduksi Error & Analisis AST",
        description: "Parse log stack trace, identifikasi file target, dan telusuri AST untuk menemukan race condition atau null dereference.",
        agentRole: "AI Code Reviewer",
        estimatedDuration: "3m",
        requiredTools: ["ast_grep", "git_blame", "log_parser"],
        systemGuidance: "Analisis AST tree di sekitar baris error. Buat fail-first unit test atau skrip replikasi yang secara konsisten membuktikan adanya bug sebelum kode diubah.",
        requiresHumanReview: false,
        outputArtifact: "AST Bug Diagnostics & Reproduction Script",
      },
      {
        id: "step-fb-2",
        order: 2,
        title: "Root Cause Hypothesis & Impact Radius",
        description: "Petakan batasan modul dan dependency yang terdampak untuk mencegah regresi ke modul lain.",
        agentRole: "Analyzer Agent #04",
        estimatedDuration: "5m",
        requiredTools: ["dependency_tracer", "code_search"],
        systemGuidance: "Tentukan batas perbaikan (blast radius). Pastikan solusi tidak mengubah public API contract dari fungsi atau modul terkait.",
        requiresHumanReview: false,
        outputArtifact: "Root Cause Analysis & Blast Radius Map",
      },
      {
        id: "step-fb-3",
        order: 3,
        title: "Pembuatan Patch Terisolasi (Minimal Diff)",
        description: "Menghasilkan perbaikan kode dengan perubahan baris sekecil mungkin sesuai in-code guidelines.",
        agentRole: "AutoFix Engineer",
        estimatedDuration: "8m",
        requiredTools: ["git_patch", "ast_transform", "syntax_validator"],
        systemGuidance: "Gunakan pendekatan patch minimalis. Hindari refactoring tidak perlu di luar scope bug. Pastikan penanganan edge-case (undefined, null, timeout) ditangani secara eksplisit.",
        requiresHumanReview: true,
        outputArtifact: "Unified Git Diff (.patch)",
      },
      {
        id: "step-fb-4",
        order: 4,
        title: "Regression & Type-Check Verification",
        description: "Jalankan pnpm test, TypeScript typecheck, dan linter untuk memastikan tidak ada fitur lain yang rusak.",
        agentRole: "Test Runner Bot",
        estimatedDuration: "6m",
        requiredTools: ["pnpm_test", "tsc_check", "eslint_run"],
        systemGuidance: "Jalankan seluruh test suite. Pastikan tes reproduksi yang tadinya gagal kini lulus (PASS), dan tidak ada regresi pada test yang sudah ada.",
        requiresHumanReview: false,
        outputArtifact: "Test Execution & Coverage Log",
      },
      {
        id: "step-fb-5",
        order: 5,
        title: "Pull Request & Ringkasan Perbaikan",
        description: "Commit patch ke branch baru, push ke GitHub, dan generate PR dengan deskripsi perubahan serta bukti test.",
        agentRole: "Delivery Bot",
        estimatedDuration: "2m",
        requiredTools: ["github_pr_create", "markdown_gen"],
        systemGuidance: "Buat PR deskriptif dengan format Conventional Commit: 'fix(core): [detail bug]'. Sertakan cara menguji dan bukti verifikasi test di deskripsi PR.",
        requiresHumanReview: true,
        outputArtifact: "GitHub Pull Request & Release Note",
      },
    ],
  },
  {
    id: "web-build",
    name: "Web Build",
    category: "Full-Stack Development",
    description:
      "Arsitektur terpandu untuk membangun web application modern end-to-end: mulai dari spesifikasi database schema, pembuatan API route handlers, komponen UI responsif, hingga verifikasi deployment siap pakai.",
    badge: "Full Suite",
    iconName: "Globe",
    isCustom: false,
    defaultModel: "Gemini 2.5 Pro (Deep Reason)",
    maxAutonomousSteps: 12,
    autoTriggerOnOrder: false,
    systemPromptTemplate:
      "Anda adalah Lead Full-Stack Architect. Bangun web application modular, aman, dan berperforma tinggi. Ikuti aturan struktur folder yang konsisten, gunakan Next.js App Router, Tailwind CSS, TypeScript strict mode, dan database ORM terbaik.",
    updatedAt: "2026-11-10T20:00:00Z",
    steps: [
      {
        id: "step-wb-1",
        order: 1,
        title: "Spesifikasi Fitur & Data Schema Blueprint",
        description: "Merumuskan ERD, relasi tabel database, dan rancangan endpoint API sebelum menulis kode.",
        agentRole: "System Architect Agent",
        estimatedDuration: "10m",
        requiredTools: ["schema_validator", "erd_builder"],
        systemGuidance: "Definisikan schema tabel lengkap dengan tipe data TypeScript, primary keys, foreign keys, indeks, dan relasi Drizzle/Postgres.",
        requiresHumanReview: true,
        outputArtifact: "Architecture Spec & Drizzle Schema Draft",
      },
      {
        id: "step-wb-2",
        order: 2,
        title: "Scaffolding & Core Architecture Setup",
        description: "Inisialisasi direktori, konfigurasi routing Next.js, font, tailwind utility, dan middleware auth.",
        agentRole: "DevOps Agent",
        estimatedDuration: "8m",
        requiredTools: ["scaffold_cli", "env_check"],
        systemGuidance: "Siapkan struktur folder rapi: lib/, components/ui/, components/features/, app/api/. Konfigurasi error boundary dan loading state.",
        requiresHumanReview: false,
        outputArtifact: "Base Project Structure & App Scaffolding",
      },
      {
        id: "step-wb-3",
        order: 3,
        title: "API Routes & Server Actions Development",
        description: "Bangun endpoint backend untuk CRUD data dengan validasi schema (Zod) dan sanitasi input.",
        agentRole: "Backend Engineer Bot",
        estimatedDuration: "15m",
        requiredTools: ["api_tester", "drizzle_runner"],
        systemGuidance: "Terapkan REST / Server Actions yang efisien dengan penanganan status error 400, 401, 404, 500 terstandar. Hindari raw SQL queries tanpa parameterized safety.",
        requiresHumanReview: false,
        outputArtifact: "Route Handlers & Data Access Layer",
      },
      {
        id: "step-wb-4",
        order: 4,
        title: "Perakitan UI Komponen & Responsive Views",
        description: "Implementasi antarmuka dashboard / pages dengan shadcn/ui dan Tailwind CSS modern.",
        agentRole: "Frontend Engineer Bot",
        estimatedDuration: "20m",
        requiredTools: ["component_generator", "tailwind_linter"],
        systemGuidance: "Susun antarmuka yang clean, modular, dan responsif dari mobile (320px) hingga wide screen (1920px). Terapkan reusable component architecture.",
        requiresHumanReview: false,
        outputArtifact: "Component Library & Responsive Pages",
      },
      {
        id: "step-wb-5",
        order: 5,
        title: "E2E Testing, Security & Performance Audit",
        description: "Audit keamanan CORS, token leakage, render optimization, serta pengujian end-to-end alur utama.",
        agentRole: "QA Sentinel",
        estimatedDuration: "10m",
        requiredTools: ["pnpm_build", "lighthouse_audit", "security_scanner"],
        systemGuidance: "Pastikan pnpm build sukses tanpa warning kritis, no circular dependencies, dan skor Core Web Vitals memadai.",
        requiresHumanReview: true,
        outputArtifact: "E2E Audit Report & Production Build",
      },
    ],
  },
  {
    id: "landing-page",
    name: "Landing Page",
    category: "Marketing & Conversion",
    description:
      "Workflow terfokus untuk membuat landing page berkonversi tinggi, estetik, fast-loading, SEO-ready, dan siap pakai untuk produk atau promosi bisnis.",
    badge: "High Conversion",
    iconName: "Sparkles",
    isCustom: false,
    defaultModel: "Gemini 2.5 Flash (Speed)",
    maxAutonomousSteps: 6,
    autoTriggerOnOrder: true,
    systemPromptTemplate:
      "Anda adalah UI/UX & Conversion Specialist. Tugas Anda adalah menciptakan landing page yang memikat mata, memiliki hierarki visual kuat, copy yang persuasif, micro-interactions elegan, serta kecepatan load instan.",
    updatedAt: "2026-11-10T20:00:00Z",
    steps: [
      {
        id: "step-lp-1",
        order: 1,
        title: "Ekstraksi Brand Identity, Value Proposition & Copy",
        description: "Menetapkan color palette, tone of voice, hierarki judul (H1/H2), dan struktur section utama.",
        agentRole: "Design Strategist Agent",
        estimatedDuration: "4m",
        requiredTools: ["copy_analyzer", "palette_generator"],
        systemGuidance: "Petakan sections: Hero -> Social Proof (Logo Cloud) -> Problem & Solution -> Features Grid -> Testimonials -> Pricing / Offer -> FAQ -> Final CTA.",
        requiresHumanReview: false,
        outputArtifact: "Content Architecture & Design Tokens",
      },
      {
        id: "step-lp-2",
        order: 2,
        title: "Hero Section & Visual Anchor Development",
        description: "Membangun bagian Hero dengan badge tren, headline kuat, CTA ganda, dan preview grafis/mockup interaktif.",
        agentRole: "Tailwind Specialist",
        estimatedDuration: "8m",
        requiredTools: ["lucide_icons", "tailwind_css"],
        systemGuidance: "Buat Hero section yang 'above-the-fold' memikat. Gunakan subtle gradient, border highlight, dan typography yang seimbang.",
        requiresHumanReview: false,
        outputArtifact: "Interactive Hero Section Component",
      },
      {
        id: "step-lp-3",
        order: 3,
        title: "Sections Assembly: Features, Social Proof & Pricing",
        description: "Menyusun grid fitur dengan card elegan, badge perbandingan harga, dan testimonials slider.",
        agentRole: "Frontend Polish Bot",
        estimatedDuration: "12m",
        requiredTools: ["component_builder", "responsive_tester"],
        systemGuidance: "Pastikan kartu fitur memiliki hover lift effect yang halus, tooltip penjelas, dan responsif sempurna di perangkat mobile.",
        requiresHumanReview: false,
        outputArtifact: "Complete Landing Page Section Suite",
      },
      {
        id: "step-lp-4",
        order: 4,
        title: "SEO, OpenGraph & Performance Optimization",
        description: "Injeksi metadata Next.js, favicon, dynamic OG image tag, dan optimasi kompresi gambar.",
        agentRole: "Performance Sentinel",
        estimatedDuration: "5m",
        requiredTools: ["seo_metadata", "lighthouse_runner"],
        systemGuidance: "Tambahkan semantic HTML (main, header, footer, article, section) serta structured JSON-LD data untuk ranking search engine.",
        requiresHumanReview: true,
        outputArtifact: "SEO Metadata Pack & Lighthouse 95+ Audit",
      },
    ],
  },
  {
    id: "single-simple-page",
    name: "Single Simple Page",
    category: "Lightweight UI Page",
    description:
      "Alur kerja cepat dan hemat token untuk membuat satu halaman fungsional mandiri seperti form kontak, halaman FAQ, detail profil, atau halaman konfirmasi.",
    badge: "Fast Delivery",
    iconName: "FileCode",
    isCustom: false,
    defaultModel: "Gemini 2.5 Flash (Speed)",
    maxAutonomousSteps: 5,
    autoTriggerOnOrder: true,
    systemPromptTemplate:
      "Anda adalah Clean Code Frontend Developer. Fokus pada kesederhanaan, kode yang bersih dan mudah dirawat, penanganan state lokal yang tepat, dan waktu pengerjaan super cepat.",
    updatedAt: "2026-11-10T20:00:00Z",
    steps: [
      {
        id: "step-ssp-1",
        order: 1,
        title: "Ekstraksi Kebutuhan & Struktur State Halaman",
        description: "Identifikasi komponen input, tombol interaksi, dan state reaktif yang dibutuhkan.",
        agentRole: "Logic Architect Bot",
        estimatedDuration: "2m",
        requiredTools: ["schema_inspector"],
        systemGuidance: "Tentukan apakah halaman membutuhkan Client Component atau Server Component. Siapkan state management minimalis (useState / useActionState).",
        requiresHumanReview: false,
        outputArtifact: "Page State & Interface Blueprint",
      },
      {
        id: "step-ssp-2",
        order: 2,
        title: "Implementasi Halaman Modular & Terpadu",
        description: "Menulis kode halaman lengkap dalam satu file atau sub-komponen teratur dengan TypeScript ketat.",
        agentRole: "React Engineer Agent",
        estimatedDuration: "6m",
        requiredTools: ["react_compiler", "tailwind_css"],
        systemGuidance: "Gunakan komponen shadcn/ui (Button, Card, Input, Badge). Pastikan kode rapi tanpa redundansi inline styling.",
        requiresHumanReview: false,
        outputArtifact: "Production Single Page Component",
      },
      {
        id: "step-ssp-3",
        order: 3,
        title: "Validasi Form, Feedback Toast & Error Boundary",
        description: "Menerapkan toast notifikasi interaktif (Sonner) dan penanganan input kosong atau format salah.",
        agentRole: "Reliability Bot",
        estimatedDuration: "3m",
        requiredTools: ["toast_integration", "validator"],
        systemGuidance: "Beri pengguna visual feedback instan saat interaksi (loading spinner pada tombol, toast sukses/gagal).",
        requiresHumanReview: false,
        outputArtifact: "UX Feedback & Form Validation Logic",
      },
      {
        id: "step-ssp-4",
        order: 4,
        title: "Linting & Verifikasi Responsif",
        description: "Pemeriksaan ESLint, format Prettier, dan pengecekan responsivitas layout.",
        agentRole: "Design Reviewer",
        estimatedDuration: "2m",
        requiredTools: ["eslint_run", "prettier_format"],
        systemGuidance: "Pastikan kode lolos validasi sintaks tanpa typescript warning dan tampilan tidak meluap (no horizontal scrollbar).",
        requiresHumanReview: true,
        outputArtifact: "Clean Code Audit & Ready-to-Merge Status",
      },
    ],
  },
  {
    id: "single-simple-page-low-to-high",
    name: "Single Simple Page Low to High",
    category: "UI/UX Elevation & Refinement",
    description:
      "Workflow khusus untuk meningkatkan kualitas visual halaman web dari wireframe/mockup kasar (low-fidelity) menjadi desain berstandar industri kelas dunia (high-fidelity) dengan kedalaman visual, micro-interactions, dan tipografi presisi.",
    badge: "Fidelity Upgrade",
    iconName: "Layers",
    isCustom: false,
    defaultModel: "Gemini 2.5 Pro (Deep Reason)",
    maxAutonomousSteps: 7,
    autoTriggerOnOrder: true,
    systemPromptTemplate:
      "Anda adalah Master UI/UX Designer & Frontend Artisan. Peran Anda adalah mentransformasikan halaman web yang datar, kaku, atau minim gaya (low fidelity) menjadi karya high-fidelity yang mewah, berkelas, memiliki visual rhythm, micro-interactions, dan kontras yang memanjakan mata.",
    updatedAt: "2026-11-10T20:00:00Z",
    steps: [
      {
        id: "step-lth-1",
        order: 1,
        title: "Audit Low-Fidelity & Pemetaan Kelemahan Visual",
        description: "Analisis layout awal: deteksi kelemahan spacing, hierarchy yang kabur, warna monoton, dan kurangnya visual weight.",
        agentRole: "Skeleton Auditor Bot",
        estimatedDuration: "3m",
        requiredTools: ["dom_analyzer", "contrast_checker"],
        systemGuidance: "Identifikasi area mana saja yang perlu ditingkatkan: ukuran font (type-scale), padding/margin yang terlalu rapat, ketiadaan depth, dan ikon yang tidak konsisten.",
        requiresHumanReview: false,
        outputArtifact: "Low-Fidelity Audit & Gap Analysis Matrix",
      },
      {
        id: "step-lth-2",
        order: 2,
        title: "Penerapan Skala Tipografi & Spacing Rhythm",
        description: "Menerapkan font hierarchy modern, tracking teks proporsional, dan vertical rhythm 8pt grid.",
        agentRole: "UI Sculptor Agent",
        estimatedDuration: "5m",
        requiredTools: ["tailwind_typography", "font_loader"],
        systemGuidance: "Terapkan kontras ukuran yang jelas antara H1, H2, body text, dan caption. Gunakan font weights (semibold/medium) untuk mempertegas pemisah informasi.",
        requiresHumanReview: false,
        outputArtifact: "Typography Scale & Vertical Rhythm Spec",
      },
      {
        id: "step-lth-3",
        order: 3,
        title: "Elevasi Visual (Depth, Shadows, Badges, & Color Accents)",
        description: "Menambahkan subtle shadows, border halus, background blur (glassmorphism), dan aksen warna elegan.",
        agentRole: "Styling Master",
        estimatedDuration: "8m",
        requiredTools: ["tailwind_elevation", "color_tokens"],
        systemGuidance: "Tingkatkan card dengan border border-neutral-200, shadow-xs/shadow-sm, soft rounded corners, dan aksen warna primer yang harmonis.",
        requiresHumanReview: false,
        outputArtifact: "High-Fidelity Component Facelift",
      },
      {
        id: "step-lth-4",
        order: 4,
        title: "Micro-Interactions & Hover Polish",
        description: "Menyisipkan transisi halus, animasi interaktif saat kursor melintas, active click feedback, dan loading skeleton.",
        agentRole: "Motion Engineer Bot",
        estimatedDuration: "6m",
        requiredTools: ["tailwind_animations", "micro_transitions"],
        systemGuidance: "Gunakan transition-all duration-200 ease-in-out pada interaksi tombol, kartu, dan link. Jangan berlebihan agar tetap terasa profesional.",
        requiresHumanReview: false,
        outputArtifact: "Micro-Interactions & Animation Layer",
      },
      {
        id: "step-lth-5",
        order: 5,
        title: "Inspeksi Komparasi Before vs After & Final QA",
        description: "Validasi perbandingan visual sebelum vs sesudah peningkatan, kepatuhan WCAG accessibility, dan final polish.",
        agentRole: "Visual QA Inspector",
        estimatedDuration: "4m",
        requiredTools: ["visual_diff", "accessibility_audit"],
        systemGuidance: "Bandingkan halaman hasil high-fidelity dengan source asli. Pastikan fungsi tidak berubah, namun estetika naik level secara dramatis.",
        requiresHumanReview: true,
        outputArtifact: "Before/After Visual Benchmark Report",
      },
    ],
  },
];

const LOCAL_STORAGE_KEY = "rafa_company_agent_workflows_v1";

export function getStoredWorkflows(): JobWorkflow[] {
  if (typeof window === "undefined") {
    return DEFAULT_WORKFLOWS;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return DEFAULT_WORKFLOWS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn("Failed to load workflows from localStorage, using defaults", err);
  }
  return DEFAULT_WORKFLOWS;
}

export function saveStoredWorkflows(workflows: JobWorkflow[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(workflows));
  } catch (err) {
    console.error("Failed to save workflows to localStorage", err);
  }
}

export function resetWorkflowsToDefault(): JobWorkflow[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
  return DEFAULT_WORKFLOWS;
}

export function generateAgentSOPMarkdown(
  workflow: JobWorkflow,
  contextJob?: { title?: string; orderId?: string; repoUrl?: string; clientName?: string }
): string {
  const stepsList = workflow.steps
    .map(
      (s, idx) =>
        `### Langkah ${idx + 1}: ${s.title}\n` +
        `- **Penanggung Jawab (Agent Role)**: ${s.agentRole}\n` +
        `- **Estimasi Durasi**: ${s.estimatedDuration}\n` +
        `- **Perlu Konfirmasi Manusia**: ${s.requiresHumanReview ? "YA (Wajib Review)" : "TIDAK (Otomatis)"}\n` +
        `- **Tools Wajib**: ${s.requiredTools.map((t) => `\`${t}\``).join(", ")}\n` +
        `- **Target Artifact**: ${s.outputArtifact}\n` +
        `- **Instruksi Eksekusi**: ${s.systemGuidance}\n`
    )
    .join("\n");

  return `# SOP EKSEKUSI AI AGENT — WORKFLOW [${workflow.name.toUpperCase()}]
## Konfigurasi Pipeline & Guardrails

- **ID Workflow**: \`${workflow.id}\`
- **Kategori**: ${workflow.category}
- **Default AI Model**: ${workflow.defaultModel}
- **Batas Maksimal Langkah Otonom**: ${workflow.maxAutonomousSteps} Langkah
- **Auto-Trigger dari Order Masuk**: ${workflow.autoTriggerOnOrder ? "Aktif (Otomatis Mulai)" : "Manual Trigger"}
${
  contextJob
    ? `
## Informasi Tugas Aktif
- **Order ID**: ${contextJob.orderId || "N/A"}
- **Client**: ${contextJob.clientName || "N/A"}
- **Judul Tugas**: ${contextJob.title || "Tugas Pekerjaan"}
- **Target Repo**: ${contextJob.repoUrl || "N/A"}
`
    : ""
}

---

## 1. System Directive (Acuan Induk Agent)
${workflow.systemPromptTemplate}

---

## 2. Rangkaian Pipeline Terstruktur
${stepsList}

---

## 3. Ketentuan Penyelesaian (Definition of Done)
1. Setiap langkah harus menghasilkan target artifact yang telah ditentukan sebelum melangkah ke step berikutnya.
2. Jika langkah ditandai 'Wajib Review', agent dilarang melakukan commit akhir tanpa approval operator.
3. Seluruh baris kode wajib memenuhi standard TypeScript strict dan Tailwind styling yang terisolasi.
`;
}
