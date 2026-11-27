// views.js — the five pages of Kantong Rumah, rendered as HTML strings.
// main.js mounts the returned HTML and wires the controls by data-action.

import { rupiah, rupiahShort, monthLabel, dateLabel, pctUsed } from './format.js';
import { CATEGORIES, categoryById, HISTORY } from './data.js';
import { donutChart, monthlyBars, budgetBar } from './charts.js';

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function monthTransactions(state) {
  return state.transactions
    .filter((t) => t.date.startsWith(state.month))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.id < b.id ? 1 : -1));
}

export function monthTotals(state) {
  let income = 0;
  let spent = 0;
  for (const t of state.transactions) {
    if (!t.date.startsWith(state.month)) continue;
    if (t.kind === 'in') income += t.amount;
    else spent += t.amount;
  }
  return { income, spent, balance: income - spent };
}

export function categorySpent(state) {
  const map = {};
  for (const c of CATEGORIES) map[c.id] = 0;
  for (const t of state.transactions) {
    if (t.kind !== 'out' || !t.date.startsWith(state.month)) continue;
    if (t.category && map[t.category] !== undefined) map[t.category] += t.amount;
  }
  return map;
}

function txRow(t) {
  const cat = t.category ? categoryById(t.category) : null;
  const sign = t.kind === 'in' ? '+' : '−';
  const cls = t.kind === 'in' ? 'tx-in' : 'tx-out';
  const dot = cat ? `<span class="dot" style="background:${cat.color}"></span>` : '<span class="dot" style="background:#1f5c46"></span>';
  return `<li class="tx-row">
    ${dot}
    <div class="tx-main"><strong>${esc(t.label)}</strong><span>${dateLabel(t.date)}${cat ? ' · ' + esc(cat.name) : ''}</span></div>
    <span class="tx-amount ${cls}">${sign} ${rupiah(t.amount)}</span>
    <button class="icon-btn" data-action="delete-tx" data-id="${t.id}" title="Hapus transaksi" aria-label="Hapus ${esc(t.label)}">✕</button>
  </li>`;
}

// ---------------- Dashboard ----------------
function renderDashboard(state) {
  const { income, spent, balance } = monthTotals(state);
  const saveRate = income > 0 ? Math.round((balance / income) * 100) : 0;
  const byCat = categorySpent(state);
  const parts = CATEGORIES.map((c) => ({ label: c.name, value: byCat[c.id], color: c.color }))
    .filter((p) => p.value > 0)
    .sort((a, b) => b.value - a.value);
  const totalBudget = CATEGORIES.reduce((s, c) => s + (state.budgets[c.id] || 0), 0);
  const budgetPct = totalBudget > 0 ? Math.round((spent / totalBudget) * 100) : 0;
  const recent = monthTransactions(state).slice(0, 5);
  const legend = parts.slice(0, 5).map((p) => {
    const pct = spent > 0 ? Math.round((p.value / spent) * 100) : 0;
    return `<li><span class="dot" style="background:${p.color}"></span>${esc(p.label)}<b>${rupiahShort(p.value)}</b><span class="muted">${pct}%</span></li>`;
  }).join('');

  return `
  <section class="cards">
    <article class="stat-card"><span>Pemasukan</span><strong class="green">${rupiah(income)}</strong><em>${monthLabel(state.month)}</em></article>
    <article class="stat-card"><span>Pengeluaran</span><strong class="terracotta">${rupiah(spent)}</strong><em>${budgetPct}% dari anggaran</em></article>
    <article class="stat-card highlight"><span>Sisa uang</span><strong>${rupiah(balance)}</strong><em>Tabungan ${saveRate}% dari pemasukan</em></article>
  </section>
  <section class="grid-2">
    <article class="panel">
      <h2>Belanja per kategori</h2>
      <div class="donut-wrap">${donutChart(parts, spent)}<ul class="legend">${legend}</ul></div>
    </article>
    <article class="panel">
      <h2>Transaksi terakhir</h2>
      <ul class="tx-list">${recent.map(txRow).join('')}</ul>
      <a class="link-more" href="#/transaksi">Lihat semua transaksi →</a>
    </article>
  </section>
  <section class="panel">
    <h2>Ringkasan bulan ini</h2>
    <p class="summary">Keluarga ini memakai <b>${rupiah(spent)}</b> dari anggaran <b>${rupiah(totalBudget)}</b> (${budgetPct}%).
    Sisa <b>${rupiah(balance)}</b> — cukup untuk ditabung atau dipakai cadangan bulan depan.
    Kategori terbesar bulan ini: <b>${esc(parts[0] ? parts[0].label : '—')}</b> (${rupiahShort(parts[0] ? parts[0].value : 0)}).</p>
  </section>`;
}

// ---------------- Transaksi ----------------
function renderTransactions(state, ui) {
  const all = monthTransactions(state);
  const filtered = all.filter((t) => {
    if (ui.txKind !== 'all' && t.kind !== ui.txKind) return false;
    if (ui.txCat !== 'all' && t.category !== ui.txCat) return false;
    return true;
  });
  const catOptions = CATEGORIES.map((c) => `<option value="${c.id}"${ui.txCat === c.id ? ' selected' : ''}>${esc(c.name)}</option>`).join('');
  const formCats = CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('');

  return `
  <section class="panel">
    <h2>Tambah transaksi</h2>
    <form id="tx-form" class="tx-form">
      <label>Tanggal<input id="f-date" type="date" value="${state.month}-15" required></label>
      <label>Jenis<select id="f-kind"><option value="out">Pengeluaran</option><option value="in">Pemasukan</option></select></label>
      <label>Kategori<select id="f-cat">${formCats}</select></label>
      <label>Keterangan<input id="f-label" type="text" placeholder="cth: Belanja pasar" maxlength="60" required></label>
      <label>Jumlah (Rp)<input id="f-amount" type="number" min="1000" step="500" placeholder="50000" required></label>
      <button class="btn primary" type="submit">Simpan transaksi</button>
    </form>
    <p class="hint">Transaksi tersimpan di peramban ini (localStorage) dan langsung mengubah total, grafik, dan anggaran.</p>
  </section>
  <section class="panel">
    <h2>Semua transaksi — ${monthLabel(state.month)}</h2>
    <div class="filters">
      <label>Jenis <select data-action="filter-kind">
        <option value="all"${ui.txKind === 'all' ? ' selected' : ''}>Semua</option>
        <option value="out"${ui.txKind === 'out' ? ' selected' : ''}>Pengeluaran</option>
        <option value="in"${ui.txKind === 'in' ? ' selected' : ''}>Pemasukan</option>
      </select></label>
      <label>Kategori <select data-action="filter-cat">
        <option value="all"${ui.txCat === 'all' ? ' selected' : ''}>Semua kategori</option>
        ${catOptions}
      </select></label>
      <span class="muted">${filtered.length} dari ${all.length} transaksi</span>
    </div>
    <ul class="tx-list">${filtered.length ? filtered.map(txRow).join('') : '<li class="empty">Tidak ada transaksi yang cocok dengan filter.</li>'}</ul>
  </section>`;
}

// ---------------- Anggaran ----------------
function renderBudgets(state) {
  const byCat = categorySpent(state);
  const totalBudget = CATEGORIES.reduce((s, c) => s + (state.budgets[c.id] || 0), 0);
  const totalSpent = CATEGORIES.reduce((s, c) => s + byCat[c.id], 0);
  const rows = CATEGORIES.map((c) => {
    const spent = byCat[c.id];
    const budget = state.budgets[c.id] || 0;
    const pct = pctUsed(spent, budget);
    const over = spent > budget;
    return `<li class="budget-row">
      <span class="dot" style="background:${c.color}"></span>
      <div class="budget-main">
        <div class="budget-head"><strong>${esc(c.name)}</strong><span>${rupiah(spent)} dari ${rupiah(budget)} · ${pct}%</span></div>
        ${budgetBar(spent, budget)}
        ${over ? '<span class="over">Lewat anggaran ' + rupiah(spent - budget) + '</span>' : ''}
      </div>
      <label class="budget-edit">Rp <input type="number" min="0" step="10000" value="${budget}" data-budget-input="${c.id}" aria-label="Anggaran ${esc(c.name)}">
      <button class="btn small" data-action="budget-save" data-cat="${c.id}">Ubah</button></label>
    </li>`;
  }).join('');

  return `
  <section class="cards">
    <article class="stat-card"><span>Total anggaran</span><strong>${rupiah(totalBudget)}</strong><em>${monthLabel(state.month)}</em></article>
    <article class="stat-card"><span>Sudah dipakai</span><strong class="terracotta">${rupiah(totalSpent)}</strong><em>${pctUsed(totalSpent, totalBudget)}% dari total</em></article>
    <article class="stat-card"><span>Sisa anggaran</span><strong class="green">${rupiah(totalBudget - totalSpent)}</strong><em>untuk sisa bulan ini</em></article>
  </section>
  <section class="panel">
    <h2>Anggaran per kategori</h2>
    <p class="hint">Ubah angka anggaran lewat kolom di kanan tiap baris, lalu tekan Ubah. Warna batang berubah saat pemakaian mendekati batas.</p>
    <ul class="budget-list">${rows}</ul>
  </section>`;
}

// ---------------- Tagihan ----------------
function renderBills(state) {
  const total = state.bills.reduce((s, b) => s + b.amount, 0);
  const paid = state.bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);
  const unpaid = total - paid;
  const rows = [...state.bills].sort((a, b) => a.dueDay - b.dueDay).map((b) => {
    const status = b.paid
      ? '<span class="chip ok">Lunas</span>'
      : '<span class="chip warn">Belum dibayar</span>';
    return `<li class="bill-row">
      <div class="bill-main"><strong>${esc(b.name)}</strong><span>Jatuh tempo tanggal ${b.dueDay} · ${monthLabel(state.month)}</span></div>
      <span class="bill-amount">${rupiah(b.amount)}</span>
      ${status}
      <button class="btn small" data-action="toggle-bill" data-id="${b.id}">${b.paid ? 'Batalkan lunas' : 'Tandai lunas'}</button>
    </li>`;
  }).join('');

  return `
  <section class="cards">
    <article class="stat-card"><span>Total tagihan</span><strong>${rupiah(total)}</strong><em>6 tagihan rutin</em></article>
    <article class="stat-card"><span>Sudah dibayar</span><strong class="green">${rupiah(paid)}</strong><em>${state.bills.filter((b) => b.paid).length} dari ${state.bills.length} tagihan</em></article>
    <article class="stat-card"><span>Belum dibayar</span><strong class="terracotta">${rupiah(unpaid)}</strong><em>segera lunasi sebelum jatuh tempo</em></article>
  </section>
  <section class="panel">
    <h2>Tagihan rutin bulan ini</h2>
    <p class="hint">Tombol "Tandai lunas" mengubah status tagihan dan langsung memperbarui ringkasan di atas.</p>
    <ul class="bill-list">${rows}</ul>
  </section>`;
}

// ---------------- Laporan ----------------
function renderReport(state) {
  const months = [...HISTORY];
  for (const ym of ['2026-10', '2026-11']) {
    const probe = { ...state, month: ym };
    const { income, spent } = monthTotals(probe);
    months.push({ month: ym, income, spent });
  }
  const short = { '2026-06': 'Jun', '2026-07': 'Jul', '2026-08': 'Agu', '2026-09': 'Sep', '2026-10': 'Okt', '2026-11': 'Nov' };
  const rows = months.map((m) => ({ ...m, short: short[m.month] || m.month }));
  const nov = monthTotals({ ...state, month: '2026-11' });
  const oct = monthTotals({ ...state, month: '2026-10' });
  const byCatNov = categorySpent({ ...state, month: '2026-11' });
  const topNov = CATEGORIES.map((c) => ({ name: c.name, spent: byCatNov[c.id] })).sort((a, b) => b.spent - a.spent)[0];
  const overOct = CATEGORIES.filter((c) => {
    const spent = categorySpent({ ...state, month: '2026-10' })[c.id];
    return spent > (state.budgets[c.id] || 0);
  });
  const avgSpent = Math.round(rows.reduce((s, r) => s + r.spent, 0) / rows.length);
  const saveNov = nov.income > 0 ? Math.round(((nov.income - nov.spent) / nov.income) * 100) : 0;
  const saveOct = oct.income > 0 ? Math.round(((oct.income - oct.spent) / oct.income) * 100) : 0;

  const compare = CATEGORIES.map((c) => {
    const sOct = categorySpent({ ...state, month: '2026-10' })[c.id];
    const sNov = byCatNov[c.id];
    const diff = sNov - sOct;
    const arrow = diff > 0 ? '▲' : diff < 0 ? '▼' : '—';
    const cls = diff > 0 ? 'up' : diff < 0 ? 'down' : '';
    return `<tr><td><span class="dot" style="background:${c.color}"></span> ${esc(c.name)}</td><td>${rupiah(sOct)}</td><td>${rupiah(sNov)}</td><td class="${cls}">${arrow} ${rupiah(Math.abs(diff))}</td></tr>`;
  }).join('');

  return `
  <section class="cards">
    <article class="stat-card"><span>Rata-rata belanja / bulan</span><strong>${rupiah(avgSpent)}</strong><em>6 bulan terakhir</em></article>
    <article class="stat-card"><span>Tabungan November</span><strong class="green">${saveNov}%</strong><em>Oktober ${saveOct}% — ${saveNov >= saveOct ? 'membaik' : 'menurun'}</em></article>
    <article class="stat-card"><span>Kategori terbesar Nov</span><strong>${esc(topNov.name)}</strong><em>${rupiah(topNov.spent)} bulan ini</em></article>
  </section>
  <section class="panel">
    <h2>Pemasukan vs pengeluaran — 6 bulan</h2>
    <div class="chart-legend"><span><i style="background:#1f5c46"></i> Pemasukan</span><span><i style="background:#c96a3b"></i> Pengeluaran</span></div>
    ${monthlyBars(rows)}
    <p class="hint">Pengeluaran selalu di bawah pemasukan dalam 6 bulan terakhir — keluarga ini menabung setiap bulan.</p>
  </section>
  <section class="panel">
    <h2>Oktober vs November per kategori</h2>
    <p class="hint">Oktober: ${overOct.length ? overOct.map((c) => esc(c.name)).join(' dan ') + ' lewat anggaran.' : 'semua kategori dalam anggaran.'} November: semua kategori masih dalam anggaran.</p>
    <table class="compare"><thead><tr><th>Kategori</th><th>Oktober</th><th>November</th><th>Selisih</th></tr></thead><tbody>${compare}</tbody></table>
  </section>`;
}

export function renderView(route, state, ui) {
  switch (route) {
    case 'transaksi': return renderTransactions(state, ui);
    case 'anggaran': return renderBudgets(state);
    case 'tagihan': return renderBills(state);
    case 'laporan': return renderReport(state);
    case 'dashboard':
    default: return renderDashboard(state);
  }
}
