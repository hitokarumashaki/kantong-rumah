// main.js — router, state, and wiring for Kantong Rumah.
// Hash routes: #/ Dashboard, #/transaksi, #/anggaran, #/tagihan, #/laporan.
// State lives in localStorage so edits survive a reload.

import { seedState, MONTHS } from './data.js';
import { monthLabel } from './format.js';
import { renderView, monthTotals } from './views.js';

const STORE_KEY = 'kantong-rumah-data-v1';
const ROUTES = {
  '': 'dashboard',
  'transaksi': 'transaksi',
  'anggaran': 'anggaran',
  'tagihan': 'tagihan',
  'laporan': 'laporan',
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.transactions) && parsed.month) return parsed;
    }
  } catch (e) { /* corrupted store: fall through to seed */ }
  return seedState();
}

function saveState(state) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage full or blocked */ }
}

const state = loadState();
const ui = { txKind: 'all', txCat: 'all' };

const app = document.getElementById('app');
const monthLabelEl = document.getElementById('month-label');

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, '').split('/')[0];
  return ROUTES[hash] || 'dashboard';
}

function render() {
  const route = currentRoute();
  document.querySelectorAll('.nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#/' + (route === 'dashboard' ? '' : route));
  });
  monthLabelEl.textContent = monthLabel(state.month);
  document.getElementById('month-prev').disabled = state.month <= MONTHS[0];
  document.getElementById('month-next').disabled = state.month >= MONTHS[MONTHS.length - 1];
  app.innerHTML = renderView(route, state, ui);
}

function switchMonth(dir) {
  const i = MONTHS.indexOf(state.month);
  const next = MONTHS[i + dir];
  if (!next) return;
  state.month = next;
  saveState(state);
  render();
}

function addTransaction(form) {
  const date = form.querySelector('#f-date').value;
  const kind = form.querySelector('#f-kind').value;
  const category = kind === 'out' ? form.querySelector('#f-cat').value : null;
  const label = form.querySelector('#f-label').value.trim();
  const amount = Math.round(Number(form.querySelector('#f-amount').value));
  if (!date || !label || !amount || amount <= 0) return;
  const id = 'u' + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
  state.transactions.push({ id, date, kind, category, label, amount });
  if (!date.startsWith(state.month)) state.month = date.slice(0, 7);
  saveState(state);
  render();
}

document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-action]');
  if (!el) return;
  const action = el.getAttribute('data-action');
  if (action === 'delete-tx') {
    state.transactions = state.transactions.filter((t) => t.id !== el.getAttribute('data-id'));
    saveState(state);
    render();
  } else if (action === 'toggle-bill') {
    const bill = state.bills.find((b) => b.id === el.getAttribute('data-id'));
    if (bill) { bill.paid = !bill.paid; saveState(state); render(); }
  } else if (action === 'budget-save') {
    const cat = el.getAttribute('data-cat');
    const input = document.querySelector(`[data-budget-input="${cat}"]`);
    const value = Math.round(Number(input ? input.value : NaN));
    if (cat && Number.isFinite(value) && value >= 0) {
      state.budgets[cat] = value;
      saveState(state);
      render();
    }
  } else if (action === 'month-prev') {
    switchMonth(-1);
  } else if (action === 'month-next') {
    switchMonth(1);
  }
});

document.addEventListener('change', (ev) => {
  const el = ev.target.closest('[data-action]');
  if (!el) return;
  const action = el.getAttribute('data-action');
  if (action === 'filter-kind') { ui.txKind = el.value; render(); }
  if (action === 'filter-cat') { ui.txCat = el.value; render(); }
});

document.addEventListener('submit', (ev) => {
  if (ev.target && ev.target.id === 'tx-form') {
    ev.preventDefault();
    addTransaction(ev.target);
  }
});

window.addEventListener('hashchange', render);

// First paint, and a footer note with the live totals for this month.
render();
const totals = monthTotals(state);
const foot = document.getElementById('foot-note');
if (foot) foot.textContent = `Bulan ${monthLabel(state.month)}: pemasukan ${totals.income.toLocaleString('id-ID')} · pengeluaran ${totals.spent.toLocaleString('id-ID')} · sisa ${totals.balance.toLocaleString('id-ID')}. Data tersimpan di peramban ini.`;
