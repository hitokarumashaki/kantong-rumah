// Kantong Rumah — program penyerahan (Node 22, standard library only).
//
// Situsnya tinggal di app/ sebagai file statis biasa (HTML, CSS, modul JS,
// tanpa build step dan tanpa network). Tugas program ini cuma satu: menyalin
// app/ dan screenshots/ dari repositori ke direktori output, lalu menulis
// dossier.json — ringkasan yang dibaca juri — dengan library bawaan kit.
//
// vendor/makefun-frontend.ts jangan diubah: scorer membangun ulang dossier
// dengan salinan yang sama dan membandingkan byte per byte.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// Folder repositori ini, dan folder output grader (atau MAKEFUN_OUTPUT_DIR
// saat dijalankan di luar grader).
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Batas yang dipakai scorer untuk gate (lihat RULES.txt): dossier dibatasi
// 160 KiB teks, maksimal 4 screenshot @ 256 KiB, app/ maksimal 993 entri
// dan 16 MiB.
const DOSSIER_LIMITS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

function copyIntoOutput() {
  mkdirSync(outputDir, { recursive: true });
  cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
  mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
  const shots = join(repoRoot, 'screenshots');
  if (existsSync(shots)) {
    cpSync(shots, join(outputDir, 'screenshots'), { recursive: true });
  }
}

copyIntoOutput();
const dossierPath = join(outputDir, 'dossier.json');
writeFileSync(dossierPath, buildDossier(outputDir, DOSSIER_LIMITS));

// Ringkasan singkat untuk log: berapa file yang disalin dan seberapa besar
// dossier yang ditulis. Tidak memengaruhi isi output.
const appFiles = readdirSync(join(outputDir, 'app'));
console.log(`Kantong Rumah: ${appFiles.length} file app + ${readdirSync(join(outputDir, 'screenshots')).length} screenshot -> ${outputDir}`);
console.log(`dossier.json: ${statSync(dossierPath).size} byte`);
