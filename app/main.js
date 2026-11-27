// main.js — satu tugas: merangkai aplikasi: router hash, pemuatan state,
// dan semua aksi pengguna (tambah/hapus transaksi, ubah anggaran, tandai tagihan,
// ganti bulan, filter). Render ulang halaman setiap state berubah.

import { loadStore, saveStore } from './data.js';
import { namaBulan } from './format.js';
import { renderDashboard, renderTransactions, renderBudgets, renderBills, renderReport } from './views.js';

const view = document.getElementById('view');
const monthLabel = document.getElementById('month-label');
const prevBtn = document.getElementById('month-prev');
const nextBtn = document.getElementById('month-next');
const navLinks = [...document.querySelectorAll('[data-nav]')];

const state = loadStore();
let filterCat = 'Semua';

const ROUTES = {
  '': renderDashboard,
  transaksi: (s) => renderTransactions(s, filterCat),
  anggaran: renderBudgets,
  tagihan: renderBills,
  laporan: renderReport,
};

function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  const name = hash.split('/')[0] || '';
  const render = ROUTES[name] || ROUTES[''];
  view.innerHTML = render(state);
  for (const a of navLinks) a.classList.toggle('active', (a.dataset.nav === 'dashboard' && name === '') || a.dataset.nav === name);
  monthLabel.textContent = namaBulan(state.month);
  const idx = state.months.indexOf(state.month);
  prevBtn.disabled = idx <= 0;
  nextBtn.disabled = idx >= state.months.length - 1;
  wireView();
}

function rerender() {
  saveStore(state);
  route();
}

function wireView() {
  const addForm = document.getElementById('add-tx');
  if (addForm) {
    addForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const fd = new FormData(addForm);
      const amount = Math.round(Number(fd.get('amount')));
      const label = String(fd.get('label')).trim();
      if (!label || !amount || amount <= 0) return;
      const rec = {
        id: 't' + Date.now().toString(36),
        date: String(fd.get('date')),
        label,
        category: String(fd.get('category')),
        amount,
      };
      const m = rec.date.slice(0, 7);
      if (fd.get('kind') === 'in') {
        if (!state.income[m]) state.income[m] = [];
        state.income[m].push(rec);
      } else {
        if (!state.transactions[m]) state.transactions[m] = [];
        if (!state.months.includes(m)) state.months.push(m);
        state.transactions[m].push(rec);
      }
      state.month = m;
      rerender();
    });
  }
  const filter = document.getElementById('filter-cat');
  if (filter) {
    filter.addEventListener('change', () => {
      filterCat = filter.value;
      route();
    });
  }
  for (const f of view.querySelectorAll('.budget-edit')) {
    f.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const cat = f.dataset.category;
      const v = Math.round(Number(new FormData(f).get('budget')));
      if (Number.isFinite(v) && v >= 0) state.budgets[cat] = v;
      rerender();
    });
  }
}

view.addEventListener('click', (ev) => {
  const btn = ev.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  if (action === 'delete-tx') {
    const m = state.month;
    state.transactions[m] = (state.transactions[m] || []).filter((t) => t.id !== btn.dataset.id);
    rerender();
  } else if (action === 'toggle-bill') {
    const bill = state.bills.find((b) => b.id === btn.dataset.id);
    if (bill) bill.paid = !bill.paid;
    rerender();
  }
});

prevBtn.addEventListener('click', () => {
  const idx = state.months.indexOf(state.month);
  if (idx > 0) {
    state.month = state.months[idx - 1];
    rerender();
  }
});

nextBtn.addEventListener('click', () => {
  const idx = state.months.indexOf(state.month);
  if (idx < state.months.length - 1) {
    state.month = state.months[idx + 1];
    rerender();
  }
});

window.addEventListener('hashchange', route);
route();
