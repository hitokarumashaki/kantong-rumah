// data.js — satu tugas: data awal keluarga + penyimpanan lokal (localStorage).
// Semua angka nyata dan konsisten: transaksi November dijumlahkan jadi total
// pengeluaran bulan itu, tagihan yang lunas muncul juga sebagai transaksi.

export const STORE_KEY = 'kantong-rumah-v1';

export const CATEGORIES = [
  'Belanja', 'Makan', 'Transport', 'Tagihan', 'Pendidikan', 'Hiburan', 'Kesehatan',
];

export const CATEGORY_COLORS = {
  Belanja: '#1e6b4f',
  Makan: '#d96c3f',
  Transport: '#3f7fb8',
  Tagihan: '#7a5fb0',
  Pendidikan: '#b08a2e',
  Hiburan: '#c04a6e',
  Kesehatan: '#4a9e8a',
};

export const BUDGETS = {
  Belanja: 2500000,
  Makan: 900000,
  Transport: 600000,
  Tagihan: 1200000,
  Pendidikan: 800000,
  Hiburan: 500000,
  Kesehatan: 400000,
};

export const BILLS = [
  { id: 'b1', name: 'Listrik PLN', amount: 425000, due: 10, paid: true, note: 'Token 900 VA' },
  { id: 'b2', name: 'Air PDAM', amount: 185000, due: 12, paid: true, note: 'Meteran rumah' },
  { id: 'b3', name: 'Internet IndiHome', amount: 315000, due: 15, paid: false, note: 'Paket 50 Mbps' },
  { id: 'b4', name: 'Iuran RT 05', amount: 50000, due: 5, paid: true, note: 'Keamanan + kebersihan' },
  { id: 'b5', name: 'Cicilan motor', amount: 750000, due: 20, paid: false, note: 'Vario 125, ke-14 dari 35' },
  { id: 'b6', name: 'BPJS Kesehatan', amount: 210000, due: 10, paid: false, note: 'Kelas 2, 3 jiwa' },
];

// Rekap bulanan Jun–Sep 2026 dari catatan lama keluarga (total bulanan saja).
// Okt–Nov 2026 dihitung dari transaksi yang tercatat di aplikasi.
export const HISTORY = [
  { month: '2026-06', income: 8500000, spent: 6950000 },
  { month: '2026-07', income: 8500000, spent: 7120000 },
  { month: '2026-08', income: 8700000, spent: 6480000 },
  { month: '2026-09', income: 8500000, spent: 7350000 },
];

function seed() {
  return {
    month: '2026-11',
    months: ['2026-10', '2026-11'],
    income: {
      '2026-10': [
        { id: 'i1', date: '2026-10-01', label: 'Gaji — Budi Santoso', amount: 7000000 },
        { id: 'i2', date: '2026-10-05', label: 'Usaha sampingan — warung kopi', amount: 1500000 },
      ],
      '2026-11': [
        { id: 'i3', date: '2026-11-01', label: 'Gaji — Budi Santoso', amount: 7000000 },
        { id: 'i4', date: '2026-11-05', label: 'Usaha sampingan — warung kopi', amount: 1500000 },
      ],
    },
    transactions: {
      '2026-10': [
        { id: 't1', date: '2026-10-03', label: 'Belanja mingguan — pasar', category: 'Belanja', amount: 400000 },
        { id: 't2', date: '2026-10-06', label: 'Makan siang keluarga', category: 'Makan', amount: 130000 },
        { id: 't3', date: '2026-10-08', label: 'Bensin motor', category: 'Transport', amount: 60000 },
        { id: 't4', date: '2026-10-09', label: 'Les piano anak', category: 'Pendidikan', amount: 350000 },
        { id: 't5', date: '2026-10-10', label: 'Belanja bulanan — supermarket', category: 'Belanja', amount: 850000 },
        { id: 't6', date: '2026-10-10', label: 'Listrik PLN', category: 'Tagihan', amount: 410000 },
        { id: 't7', date: '2026-10-12', label: 'Air PDAM', category: 'Tagihan', amount: 180000 },
        { id: 't8', date: '2026-10-15', label: 'Obat + vitamin', category: 'Kesehatan', amount: 120000 },
        { id: 't9', date: '2026-10-17', label: 'Belanja mingguan — pasar', category: 'Belanja', amount: 390000 },
        { id: 't10', date: '2026-10-19', label: 'Makan malam — resto', category: 'Makan', amount: 195000 },
        { id: 't11', date: '2026-10-22', label: 'Servis motor', category: 'Transport', amount: 150000 },
        { id: 't12', date: '2026-10-24', label: 'Belanja mingguan — pasar', category: 'Belanja', amount: 405000 },
      ],
      '2026-11': [
        { id: 't13', date: '2026-11-02', label: 'Belanja mingguan — pasar', category: 'Belanja', amount: 425000 },
        { id: 't14', date: '2026-11-03', label: 'Bensin motor', category: 'Transport', amount: 60000 },
        { id: 't15', date: '2026-11-04', label: 'Makan siang keluarga', category: 'Makan', amount: 125000 },
        { id: 't16', date: '2026-11-06', label: 'Pulsa + paket data', category: 'Tagihan', amount: 150000 },
        { id: 't17', date: '2026-11-07', label: 'Belanja bulanan — supermarket', category: 'Belanja', amount: 890000 },
        { id: 't18', date: '2026-11-08', label: 'Les piano anak', category: 'Pendidikan', amount: 350000 },
        { id: 't19', date: '2026-11-10', label: 'Listrik PLN', category: 'Tagihan', amount: 425000 },
        { id: 't20', date: '2026-11-11', label: 'Ojek online', category: 'Transport', amount: 45000 },
        { id: 't21', date: '2026-11-12', label: 'Makan malam — resto', category: 'Makan', amount: 210000 },
        { id: 't22', date: '2026-11-14', label: 'Obat + vitamin', category: 'Kesehatan', amount: 135000 },
        { id: 't23', date: '2026-11-15', label: 'Belanja mingguan — pasar', category: 'Belanja', amount: 380000 },
        { id: 't24', date: '2026-11-17', label: 'Buku sekolah', category: 'Pendidikan', amount: 220000 },
        { id: 't25', date: '2026-11-18', label: 'Nonton bioskop keluarga', category: 'Hiburan', amount: 180000 },
        { id: 't26', date: '2026-11-20', label: 'Air PDAM', category: 'Tagihan', amount: 185000 },
        { id: 't27', date: '2026-11-21', label: 'Belanja mingguan — pasar', category: 'Belanja', amount: 410000 },
        { id: 't28', date: '2026-11-23', label: 'Servis motor', category: 'Transport', amount: 175000 },
        { id: 't29', date: '2026-11-25', label: 'Makan siang keluarga', category: 'Makan', amount: 140000 },
        { id: 't30', date: '2026-11-26', label: 'Beras 10 kg + minyak', category: 'Belanja', amount: 165000 },
      ],
    },
    budgets: { ...BUDGETS },
    bills: BILLS.map((b) => ({ ...b })),
  };
}

export function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.transactions && parsed.budgets && parsed.bills) return parsed;
    }
  } catch {
    // penyimpanan rusak atau tidak tersedia: kembali ke data awal
  }
  return seed();
}

export function saveStore(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    // mode privat atau penyimpanan penuh: aplikasi tetap jalan di memori
  }
}

export function monthIncome(state, yyyymm) {
  return (state.income[yyyymm] || []).reduce((s, r) => s + r.amount, 0);
}

export function monthSpent(state, yyyymm) {
  return (state.transactions[yyyymm] || []).reduce((s, r) => s + r.amount, 0);
}

export function spentByCategory(state, yyyymm) {
  const out = {};
  for (const c of CATEGORIES) out[c] = 0;
  for (const t of state.transactions[yyyymm] || []) out[t.category] += t.amount;
  return out;
}
