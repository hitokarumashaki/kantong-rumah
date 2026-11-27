// charts.js — pure SVG charts for Kantong Rumah. No libraries, no network.
// Every chart is a string of SVG returned to the views.

import { rupiahShort } from './format.js';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Donut of spending by category. `parts` is [{label, value, color}].
export function donutChart(parts, total, size = 190) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const stroke = 26;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  let arcs = '';
  for (const p of parts) {
    if (!p.value || p.value <= 0) continue;
    const frac = p.value / total;
    const len = Math.max(frac * circ - 2, 0);
    arcs += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${p.color}" stroke-width="${stroke}" stroke-dasharray="${len.toFixed(1)} ${circ.toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}" />`;
    offset += frac * circ;
  }
  const inner = `<text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-total">${rupiahShort(total)}</text>`
    + `<text x="${cx}" y="${cy + 16}" text-anchor="middle" class="donut-label">belanja bulan ini</text>`;
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Donat belanja per kategori">`
    + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#eee5d3" stroke-width="${stroke}" />`
    + arcs + inner + `</svg>`;
}

// Grouped monthly bars: income (green) vs spending (terracotta) for 6 months.
export function monthlyBars(rows, width = 640, height = 220) {
  const padL = 8;
  const padB = 26;
  const padT = 12;
  const max = Math.max(...rows.map((r) => Math.max(r.income, r.spent)), 1);
  const n = rows.length;
  const slot = (width - padL * 2) / n;
  const barW = Math.min(26, slot / 3);
  let out = `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Grafik pemasukan dan pengeluaran 6 bulan">`;
  rows.forEach((r, i) => {
    const x = padL + slot * i + slot / 2;
    const hIn = ((height - padB - padT) * r.income) / max;
    const hOut = ((height - padB - padT) * r.spent) / max;
    const yBase = height - padB;
    out += `<rect x="${(x - barW - 3).toFixed(1)}" y="${(yBase - hIn).toFixed(1)}" width="${barW}" height="${hIn.toFixed(1)}" rx="3" fill="#1f5c46" />`;
    out += `<rect x="${(x + 3).toFixed(1)}" y="${(yBase - hOut).toFixed(1)}" width="${barW}" height="${hOut.toFixed(1)}" rx="3" fill="#c96a3b" />`;
    out += `<text x="${x.toFixed(1)}" y="${height - 8}" text-anchor="middle" class="bar-label">${esc(r.short)}</text>`;
  });
  out += `</svg>`;
  return out;
}

// A single horizontal budget bar: spent portion of the budget, coloured by
// how close it is to the limit (green under 80%, amber 80–100%, red over).
export function budgetBar(spent, budget) {
  const ratio = budget > 0 ? spent / budget : 0;
  const width = Math.max(0, Math.min(100, ratio * 100));
  const color = ratio > 1 ? '#b3372f' : ratio >= 0.8 ? '#c07f1a' : '#1f5c46';
  return `<div class="bar-track"><div class="bar-fill" style="width:${width.toFixed(0)}%;background:${color}"></div></div>`;
}
