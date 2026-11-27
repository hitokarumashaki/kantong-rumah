// format.js — satu tugas: semua format angka, uang, dan tanggal untuk Kantong Rumah.
// Tidak ada dependensi, tidak ada network: Intl bawaan browser saja.

export function rupiah(n) {
  const v = Math.round(Number(n) || 0);
  return 'Rp ' + v.toLocaleString('id-ID');
}

export function rupiahShort(n) {
  const v = Math.round(Number(n) || 0);
  if (Math.abs(v) >= 1000000) return 'Rp ' + (v / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt';
  if (Math.abs(v) >= 1000) return 'Rp ' + Math.round(v / 1000) + ' rb';
  return 'Rp ' + v;
}

export function persen(part, whole) {
  if (!whole) return '0%';
  return Math.round((part / whole) * 100) + '%';
}

const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function namaBulan(yyyymm) {
  const [y, m] = yyyymm.split('-').map(Number);
  return BULAN[m - 1] + ' ' + y;
}

export function namaBulanSingkat(yyyymm) {
  const [y, m] = yyyymm.split('-').map(Number);
  return BULAN[m - 1].slice(0, 3) + ' ' + String(y).slice(2);
}

export function tanggalIndo(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return d + ' ' + BULAN[m - 1].slice(0, 3) + ' ' + y;
}

export function hariDalamBulan(yyyymm) {
  const [y, m] = yyyymm.split('-').map(Number);
  return new Date(y, m, 0).getDate();
}
