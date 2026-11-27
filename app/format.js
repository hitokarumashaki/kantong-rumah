// format.js — number and date formatting for Kantong Rumah.
// Everything is Indonesian Rupiah; amounts are whole rupiah, no decimals.

export function rupiah(n) {
  const v = Math.round(Number(n) || 0);
  const sign = v < 0 ? '-' : '';
  const digits = String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return sign + 'Rp ' + digits;
}

// Short form for big numbers on cards: Rp 8,5 jt / Rp 450 rb.
export function rupiahShort(n) {
  const v = Math.round(Number(n) || 0);
  const abs = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  if (abs >= 1000000) {
    const jt = abs / 1000000;
    const txt = jt >= 10 ? String(Math.round(jt)) : String(jt.toFixed(1)).replace('.', ',');
    return sign + 'Rp ' + txt + ' jt';
  }
  if (abs >= 1000) {
    return sign + 'Rp ' + Math.round(abs / 1000) + ' rb';
  }
  return rupiah(v);
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

// '2026-11' -> 'November 2026'
export function monthLabel(ym) {
  const [y, m] = ym.split('-').map(Number);
  return MONTH_NAMES[m - 1] + ' ' + y;
}

// '2026-11-14' -> '14 Nov 2026'
export function dateLabel(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const short = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return d + ' ' + short[m - 1] + ' ' + y;
}

// Percent of a budget used, clamped to 0..100 for bar widths.
export function pctUsed(spent, budget) {
  if (!budget || budget <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((spent / budget) * 100)));
}
