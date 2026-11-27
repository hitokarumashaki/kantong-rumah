// data.js — seed data for Kantong Rumah: categories, budgets, bills,
// transactions for October and November 2026, and monthly history.
// All figures are real household numbers in Indonesian Rupiah.

export const CATEGORIES = [
  { id: 'belanja', name: 'Belanja', color: '#1f5c46', budget: 1600000 },
  { id: 'makan', name: 'Makan & Jajan', color: '#c96a3b', budget: 700000 },
  { id: 'transport', name: 'Transport', color: '#3e7cb1', budget: 300000 },
  { id: 'rumah', name: 'Rumah Tangga', color: '#8a6d3b', budget: 200000 },
  { id: 'tagihan', name: 'Tagihan', color: '#6c5ce7', budget: 850000 },
  { id: 'hiburan', name: 'Hiburan', color: '#d64570', budget: 200000 },
  { id: 'kesehatan', name: 'Kesehatan', color: '#2a9d8f', budget: 150000 },
  { id: 'pendidikan', name: 'Pendidikan', color: '#e9a319', budget: 400000 },
  { id: 'lainnya', name: 'Lainnya', color: '#8d99ae', budget: 150000 },
];

export const categoryById = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[8];

// Recurring monthly bills. `paid` is the November status; toggling it in the
// Tagihan view updates the list and the totals immediately.
export const BILLS = [
  { id: 'b1', name: 'Internet rumah', amount: 350000, dueDay: 3, paid: true },
  { id: 'b2', name: 'Listrik PLN', amount: 320000, dueDay: 5, paid: true },
  { id: 'b3', name: 'Air PDAM', amount: 95000, dueDay: 7, paid: true },
  { id: 'b4', name: 'Iuran RT', amount: 50000, dueDay: 10, paid: true },
  { id: 'b5', name: 'Cicilan motor', amount: 450000, dueDay: 15, paid: false },
  { id: 'b6', name: 'BPJS Kesehatan', amount: 105000, dueDay: 25, paid: false },
];

// Monthly history for the Laporan chart (June–September are closed months).
export const HISTORY = [
  { month: '2026-06', income: 8200000, spent: 4100000 },
  { month: '2026-07', income: 8500000, spent: 4400000 },
  { month: '2026-08', income: 8500000, spent: 4200000 },
  { month: '2026-09', income: 8500000, spent: 4600000 },
];

function tx(id, date, kind, category, label, amount) {
  return { id, date, kind, category, label, amount };
}

export function seedState() {
  return {
    month: '2026-11',
    transactions: [
      // ---- November 2026: income ----
      tx('n01', '2026-11-01', 'in', null, 'Gaji bulanan', 7000000),
      tx('n02', '2026-11-10', 'in', null, 'Usaha sampingan', 1500000),
      // ---- November 2026: spending ----
      tx('n03', '2026-11-02', 'out', 'makan', 'Warteg sarapan', 45000),
      tx('n04', '2026-11-02', 'out', 'hiburan', 'Langganan streaming', 54000),
      tx('n05', '2026-11-03', 'out', 'belanja', 'Pasar Minggu', 320000),
      tx('n06', '2026-11-03', 'out', 'tagihan', 'Internet rumah', 350000),
      tx('n07', '2026-11-04', 'out', 'transport', 'Bensin motor', 80000),
      tx('n08', '2026-11-05', 'out', 'makan', 'Kopi & sarapan', 60000),
      tx('n09', '2026-11-05', 'out', 'tagihan', 'Listrik PLN', 320000),
      tx('n10', '2026-11-06', 'out', 'rumah', 'Sabun & deterjen', 120000),
      tx('n11', '2026-11-07', 'out', 'tagihan', 'Air PDAM', 95000),
      tx('n12', '2026-11-07', 'out', 'lainnya', 'Pulsa', 50000),
      tx('n13', '2026-11-08', 'out', 'belanja', 'Supermarket', 485000),
      tx('n14', '2026-11-08', 'out', 'pendidikan', 'Buku anak', 150000),
      tx('n15', '2026-11-09', 'out', 'makan', 'Makan keluarga', 180000),
      tx('n16', '2026-11-10', 'out', 'tagihan', 'Iuran RT', 50000),
      tx('n17', '2026-11-11', 'out', 'rumah', 'Gas LPG', 28000),
      tx('n18', '2026-11-12', 'out', 'makan', 'Jajan anak', 75000),
      tx('n19', '2026-11-13', 'out', 'transport', 'Bensin motor', 85000),
      tx('n20', '2026-11-14', 'out', 'kesehatan', 'Apotek', 85000),
      tx('n21', '2026-11-15', 'out', 'belanja', 'Pasar Minggu', 275000),
      tx('n22', '2026-11-15', 'out', 'pendidikan', 'Les anak', 200000),
      tx('n23', '2026-11-16', 'out', 'hiburan', 'Bioskop keluarga', 120000),
      tx('n24', '2026-11-17', 'out', 'transport', 'Parkir & tol', 45000),
      tx('n25', '2026-11-18', 'out', 'makan', 'Warteg makan siang', 50000),
      tx('n26', '2026-11-19', 'out', 'kesehatan', 'Puskesmas', 25000),
      tx('n27', '2026-11-20', 'out', 'transport', 'Ojek online', 65000),
      tx('n28', '2026-11-21', 'out', 'lainnya', 'Cuci motor', 30000),
      tx('n29', '2026-11-22', 'out', 'belanja', 'Supermarket', 390000),
      tx('n30', '2026-11-24', 'out', 'makan', 'Makan keluarga', 210000),
      // ---- October 2026: income ----
      tx('o01', '2026-10-01', 'in', null, 'Gaji bulanan', 7000000),
      tx('o02', '2026-10-10', 'in', null, 'Usaha sampingan', 1500000),
      // ---- October 2026: spending ----
      tx('o03', '2026-10-03', 'out', 'makan', 'Warteg sarapan', 60000),
      tx('o04', '2026-10-03', 'out', 'tagihan', 'Internet rumah', 350000),
      tx('o05', '2026-10-04', 'out', 'belanja', 'Pasar Minggu', 380000),
      tx('o06', '2026-10-05', 'out', 'transport', 'Bensin motor', 90000),
      tx('o07', '2026-10-05', 'out', 'tagihan', 'Listrik PLN', 315000),
      tx('o08', '2026-10-07', 'out', 'rumah', 'Deterjen & sabun', 110000),
      tx('o09', '2026-10-07', 'out', 'tagihan', 'Air PDAM', 90000),
      tx('o10', '2026-10-10', 'out', 'tagihan', 'Iuran RT', 50000),
      tx('o11', '2026-10-11', 'out', 'belanja', 'Supermarket', 520000),
      tx('o12', '2026-10-12', 'out', 'makan', 'Makan keluarga', 240000),
      tx('o13', '2026-10-13', 'out', 'rumah', 'Gas LPG', 28000),
      tx('o14', '2026-10-14', 'out', 'transport', 'Bensin motor', 85000),
      tx('o15', '2026-10-15', 'out', 'makan', 'Jajan anak', 90000),
      tx('o16', '2026-10-16', 'out', 'pendidikan', 'Seragam sekolah', 230000),
      tx('o17', '2026-10-18', 'out', 'belanja', 'Pasar Minggu', 340000),
      tx('o18', '2026-10-20', 'out', 'makan', 'Warteg makan siang', 55000),
      tx('o19', '2026-10-21', 'out', 'transport', 'Ojek online', 75000),
      tx('o20', '2026-10-22', 'out', 'rumah', 'Peralatan dapur', 52000),
      tx('o21', '2026-10-24', 'out', 'hiburan', 'Bioskop keluarga', 176000),
      tx('o22', '2026-10-25', 'out', 'belanja', 'Supermarket', 280000),
      tx('o23', '2026-10-26', 'out', 'transport', 'Parkir & tol', 60000),
      tx('o24', '2026-10-27', 'out', 'makan', 'Makan keluarga', 235000),
      tx('o25', '2026-10-28', 'out', 'pendidikan', 'Les anak', 150000),
      tx('o26', '2026-10-29', 'out', 'kesehatan', 'Apotek', 95000),
      tx('o27', '2026-10-30', 'out', 'lainnya', 'Pulsa & kuota', 155000),
    ],
    budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])),
    bills: BILLS.map((b) => ({ ...b })),
  };
}

export const MONTHS = ['2026-10', '2026-11'];
