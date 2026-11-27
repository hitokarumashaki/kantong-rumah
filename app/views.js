// views.js — satu tugas: merender kelima halaman (Dashboard, Transaksi, Anggaran,
// Tagihan, Laporan) dari state. Murni fungsi render: mengembalikan string HTML.

import { rupiah, rupiahShort, persen, namaBulan, namaBulanSingkat, tanggalIndo, hariDalamBulan } from './format.js';
import { CATEGORIES, CATEGORY_COLORS, HISTORY, monthIncome, monthSpent, spentByCategory } from './data.js';
import { donutChart, monthlyBars, budgetBar } from './charts.js';

export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function statCard(label, value, sub, tone) {
  return `<div class="stat ${tone || ''}"><p class="stat-label">${label}</p><p class="stat-value">${value}</p><p class="stat-sub">${sub}</p></div>`;
}

export function renderDashboard(state) {
  const m = state.month;
  const income = monthIncome(state, m);
  const spent = monthSpent(state, m);
  const left = income - spent;
  const rate = income ? Math.round(((income - spent) / income) * 100) : 0;
  const byCat = spentByCategory(state, m);
  const parts = CATEGORIES.map((c) => ({ label: c, value: byCat[c], color: CATEGORY_COLORS[c] }));
  const legend = parts
    .filter((p) => p.value > 0)
    .sort((a, b) => b.value - a.value)
    .map((p) => `<li><span class="dot" style="background:${p.color}"></span>${p.label}<b>${rupiah(p.value)}</b><span class="pct">${persen(p.value, spent)}</span></li>`)
    .join('');
  const today = new Date();
  const isCurrent = m === today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
  const day = isCurrent ? today.getDate() : hariDalamBulan(m);
  const monthPct = Math.round((day / hariDalamBulan(m)) * 100);
  const unpaid = state.bills.filter((b) => !b.paid).sort((a, b) => a.due - b.due);
  const billsHtml = unpaid.length
    ? unpaid.map((b) => `<li><span>${esc(b.name)} <i>jatuh tempo tgl ${b.due}</i></span><b>${rupiah(b.amount)}</b></li>`).join('')
    : '<li class="empty">Semua tagihan bulan ini sudah lunas.</li>';
  const recent = [...(state.transactions[m] || [])].sort((a, b) => (b.date < a.date ? -1 : 1)).slice(0, 5);
  const recentHtml = recent.map((t) => `<li><span>${tanggalIndo(t.date)} — ${esc(t.label)}</span><b class="out">−${rupiah(t.amount)}</b></li>`).join('');
  const biggest = parts.filter((p) => p.value > 0).sort((a, b) => b.value - a.value)[0];

  return `
  <section class="stats">
    ${statCard('Pemasukan ' + namaBulan(m), rupiah(income), 'Gaji + usaha sampingan', 'in')}
    ${statCard('Pengeluaran ' + namaBulan(m), rupiah(spent), biggest ? 'Terbesar: ' + biggest.label + ' ' + rupiahShort(biggest.value) : '', 'out')}
    ${statCard('Sisa uang', rupiah(left), 'Tingkat tabungan ' + rate + '%', left >= 0 ? 'save' : 'over')}
  </section>
  <section class="grid-2">
    <div class="card">
      <h2>Pengeluaran per kategori</h2>
      <div class="donut-wrap">${donutChart(parts)}<ul class="legend">${legend}</ul></div>
    </div>
    <div class="card">
      <h2>Tagihan yang belum dibayar</h2>
      <ul class="rows">${billsHtml}</ul>
      <p class="card-link"><a href="#/tagihan">Lihat semua tagihan →</a></p>
      <h2 class="mt">Transaksi terakhir</h2>
      <ul class="rows">${recentHtml}</ul>
      <p class="card-link"><a href="#/transaksi">Lihat semua transaksi →</a></p>
    </div>
  </section>
  <section class="card">
    <h2>Perjalanan bulan ini</h2>
    <p class="muted">Hari ke-${day} dari ${hariDalamBulan(m)} hari di ${namaBulan(m)} (${monthPct}% bulan berjalan). Pengeluaran sejauh ini ${rupiah(spent)} dari pemasukan ${rupiah(income)} — sisa ${rupiah(left)} untuk ${hariDalamBulan(m) - day} hari ke depan.</p>
    ${budgetBar(spent, income)}
    <p class="muted small">Batang di atas membandingkan pengeluaran dengan pemasukan bulan ini.</p>
  </section>`;
}

export function renderTransactions(state, filter) {
  const m = state.month;
  const all = [...(state.transactions[m] || [])].sort((a, b) => (b.date < a.date ? -1 : 1));
  const shown = filter && filter !== 'Semua' ? all.filter((t) => t.category === filter) : all;
  const options = ['Semua', ...CATEGORIES].map((c) => `<option value="${c}"${c === filter ? ' selected' : ''}>${c}</option>`).join('');
  const rows = shown.length
    ? shown.map((t) => `<tr><td>${tanggalIndo(t.date)}</td><td>${esc(t.label)}</td><td><span class="chip" style="--c:${CATEGORY_COLORS[t.category]}">${t.category}</span></td><td class="num out">−${rupiah(t.amount)}</td><td><button class="btn danger small" data-action="delete-tx" data-id="${t.id}">Hapus</button></td></tr>`).join('')
    : '<tr><td colspan="5" class="empty">Tidak ada transaksi untuk filter ini.</td></tr>';
  const total = shown.reduce((s, t) => s + t.amount, 0);
  const incomeRows = (state.income[m] || []).map((r) => `<tr><td>${tanggalIndo(r.date)}</td><td>${esc(r.label)}</td><td><span class="chip" style="--c:#1e6b4f">Pemasukan</span></td><td class="num in">+${rupiah(r.amount)}</td><td></td></tr>`).join('');

  return `
  <section class="card">
    <h2>Transaksi — ${namaBulan(m)}</h2>
    <div class="toolbar">
      <label>Filter kategori
        <select id="filter-cat" data-action="filter-cat">${options}</select>
      </label>
      <p class="muted">Menampilkan ${shown.length} transaksi · total ${rupiah(total)}</p>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th><th></th></tr></thead>
      <tbody>${incomeRows}${rows}</tbody>
    </table></div>
  </section>
  <section class="card">
    <h2>Tambah transaksi</h2>
    <form id="add-tx" class="form-grid">
      <label>Tanggal<input type="date" name="date" value="2026-11-27" required></label>
      <label>Keterangan<input type="text" name="label" placeholder="cth: Belanja mingguan — pasar" maxlength="80" required></label>
      <label>Kategori<select name="category">${CATEGORIES.map((c) => `<option>${c}</option>`).join('')}</select></label>
      <label>Jenis<select name="kind"><option value="out">Pengeluaran</option><option value="in">Pemasukan</option></select></label>
      <label>Jumlah (Rp)<input type="number" name="amount" min="1000" step="500" placeholder="100000" required></label>
      <div class="form-actions"><button class="btn primary" type="submit">Simpan transaksi</button></div>
    </form>
    <p class="muted small">Transaksi tersimpan di browser ini (localStorage) dan langsung mengubah total, grafik, dan anggaran.</p>
  </section>`;
}

export function renderBudgets(state) {
  const m = state.month;
  const byCat = spentByCategory(state, m);
  const cards = CATEGORIES.map((c) => {
    const b = state.budgets[c];
    const s = byCat[c];
    const left = b - s;
    const status = left < 0 ? `<span class="over-text">Lewat ${rupiah(-left)}</span>` : `<span class="save-text">Sisa ${rupiah(left)}</span>`;
    return `<div class="budget-card">
      <div class="budget-head"><h3><span class="dot" style="background:${CATEGORY_COLORS[c]}"></span>${c}</h3>${status}</div>
      <p class="budget-nums">${rupiah(s)} <span class="muted">dari ${rupiah(b)}</span> · ${persen(s, b)}</p>
      ${budgetBar(s, b)}
      <form class="budget-edit" data-category="${c}">
        <label>Anggaran baru (Rp)<input type="number" name="budget" min="0" step="50000" value="${b}" required></label>
        <button class="btn small" type="submit">Simpan</button>
      </form>
    </div>`;
  }).join('');
  const totalBudget = CATEGORIES.reduce((s, c) => s + state.budgets[c], 0);
  const totalSpent = monthSpent(state, m);
  return `
  <section class="card">
    <h2>Anggaran — ${namaBulan(m)}</h2>
    <p class="muted">Total anggaran ${rupiah(totalBudget)} · terpakai ${rupiah(totalSpent)} (${persen(totalSpent, totalBudget)}). Ubah angka anggaran di tiap kartu lalu tekan Simpan — batang dan sisa langsung berubah.</p>
  </section>
  <section class="budget-grid">${cards}</section>`;
}

export function renderBills(state) {
  const total = state.bills.reduce((s, b) => s + b.amount, 0);
  const paid = state.bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);
  const unpaid = total - paid;
  const rows = [...state.bills].sort((a, b) => a.due - b.due).map((b) => `
    <div class="bill-card ${b.paid ? 'paid' : 'due'}">
      <div><h3>${esc(b.name)}</h3><p class="muted">${esc(b.note)}</p><p class="muted">Jatuh tempo tiap tanggal ${b.due}</p></div>
      <div class="bill-right"><p class="bill-amount">${rupiah(b.amount)}</p>
      <p class="bill-status">${b.paid ? '✓ Lunas' : 'Belum dibayar'}</p>
      <button class="btn small ${b.paid ? '' : 'primary'}" data-action="toggle-bill" data-id="${b.id}">${b.paid ? 'Batalkan lunas' : 'Tandai lunas'}</button></div>
    </div>`).join('');
  return `
  <section class="stats">
    ${statCard('Total tagihan bulan ini', rupiah(total), state.bills.length + ' tagihan rutin', '')}
    ${statCard('Sudah dibayar', rupiah(paid), persen(paid, total) + ' dari total', 'save')}
    ${statCard('Belum dibayar', rupiah(unpaid), state.bills.filter((b) => !b.paid).length + ' tagihan menunggu', 'out')}
  </section>
  <section class="bill-list">${rows}</section>
  <p class="muted small">Tagihan yang ditandai lunas tetap tercatat di sini; menandainya lunas juga mengubah ringkasan di atas.</p>`;
}

export function renderReport(state) {
  const rows = [
    ...HISTORY.map((h) => ({ label: namaBulanSingkat(h.month), income: h.income, spent: h.spent })),
    ...state.months.map((mm) => ({ label: namaBulanSingkat(mm), income: monthIncome(state, mm), spent: monthSpent(state, mm) })),
  ];
  const m = state.month;
  const byCat = spentByCategory(state, m);
  const top = CATEGORIES.map((c) => ({ label: c, value: byCat[c] })).sort((a, b) => b.value - a.value).slice(0, 3);
  const income = monthIncome(state, m);
  const spent = monthSpent(state, m);
  const rate = income ? Math.round(((income - spent) / income) * 100) : 0;
  const topHtml = top.map((t, i) => `<li><b>${i + 1}. ${t.label}</b> — ${rupiah(t.value)} (${persen(t.value, spent)} dari pengeluaran)</li>`).join('');
  const over = CATEGORIES.filter((c) => byCat[c] > state.budgets[c]);
  const tips = [
    `Kategori terbesar bulan ini adalah ${top[0].label} (${rupiah(top[0].value)}). Cek lagi belanja mingguan: selisih Rp 50.000 per minggu saja menghemat Rp 200.000 sebulan.`,
    over.length ? `Perhatian: ${over.join(', ')} sudah melewati anggaran. Pindahkan sisa dari kategori yang masih longgar sebelum akhir bulan.` : 'Semua kategori masih di dalam anggaran bulan ini — pertahankan sampai akhir bulan.',
    `Tingkat tabungan ${rate}% berarti Rp ${Math.max(0, income - spent).toLocaleString('id-ID')} bisa masuk tabungan bulan ini.`,
  ].map((t) => `<li>${t}</li>`).join('');

  return `
  <section class="card">
    <h2>Laporan 6 bulan — Juni sampai ${namaBulan(m)}</h2>
    <div class="legend-line"><span class="sw in"></span> Pemasukan <span class="sw out"></span> Pengeluaran</div>
    ${monthlyBars(rows)}
    <p class="muted small">Jun–Sep 2026: total bulanan dari catatan lama keluarga. Okt–Nov 2026: dihitung dari transaksi yang tercatat di aplikasi.</p>
  </section>
  <section class="grid-2">
    <div class="card">
      <h2>3 kategori terbesar — ${namaBulan(m)}</h2>
      <ol class="top-list">${topHtml}</ol>
      <p class="muted">Total pengeluaran ${rupiah(spent)} dari pemasukan ${rupiah(income)}.</p>
    </div>
    <div class="card">
      <h2>Yang bisa dihemat</h2>
      <ul class="tips">${tips}</ul>
    </div>
  </section>`;
}
