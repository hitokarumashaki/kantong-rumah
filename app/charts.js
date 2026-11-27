// charts.js — satu tugas: menggambar grafik SVG murni (tanpa library, tanpa network).
// Semua fungsi mengembalikan string SVG yang siap disisipkan ke halaman.

import { rupiahShort } from './format.js';

// Donat pengeluaran per kategori. parts: [{label, value, color}].
export function donutChart(parts, size = 180) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 12;
  const hole = r - 26;
  let offset = 0;
  const slices = parts
    .filter((p) => p.value > 0)
    .map((p) => {
      const frac = p.value / total;
      const a0 = offset * Math.PI * 2 - Math.PI / 2;
      const a1 = (offset + frac) * Math.PI * 2 - Math.PI / 2;
      offset += frac;
      const large = frac > 0.5 ? 1 : 0;
      const x0 = cx + r * Math.cos(a0);
      const y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      const xi1 = cx + hole * Math.cos(a1);
      const yi1 = cy + hole * Math.sin(a1);
      const xi0 = cx + hole * Math.cos(a0);
      const yi0 = cy + hole * Math.sin(a0);
      return `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${hole} ${hole} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${p.color}"><title>${p.label}: ${p.value.toLocaleString('id-ID')}</title></path>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Donat pengeluaran per kategori">${slices}<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" font-weight="700" fill="#233026">Total</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="12" fill="#5a6b5e">${rupiahShort(total)}</text></svg>`;
}

// Batang bulanan: pemasukan vs pengeluaran. rows: [{label, income, spent}].
export function monthlyBars(rows, width = 640, height = 260) {
  const max = Math.max(...rows.map((r) => Math.max(r.income, r.spent)), 1);
  const padL = 8;
  const padB = 26;
  const padT = 18;
  const plotH = height - padB - padT;
  const slot = (width - padL * 2) / rows.length;
  const barW = Math.min(26, slot / 3);
  const bars = rows
    .map((r, i) => {
      const x = padL + i * slot + slot / 2;
      const hIn = (r.income / max) * plotH;
      const hSp = (r.spent / max) * plotH;
      return `<rect x="${(x - barW - 3).toFixed(1)}" y="${(padT + plotH - hIn).toFixed(1)}" width="${barW}" height="${hIn.toFixed(1)}" rx="3" fill="#1e6b4f"><title>${r.label} pemasukan ${r.income.toLocaleString('id-ID')}</title></rect>` +
        `<rect x="${(x + 3).toFixed(1)}" y="${(padT + plotH - hSp).toFixed(1)}" width="${barW}" height="${hSp.toFixed(1)}" rx="3" fill="#d96c3f"><title>${r.label} pengeluaran ${r.spent.toLocaleString('id-ID')}</title></rect>` +
        `<text x="${x.toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="12" fill="#5a6b5e">${r.label}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Grafik pemasukan dan pengeluaran 6 bulan">${bars}<line x1="${padL}" y1="${padT + plotH}" x2="${width - padL}" y2="${padT + plotH}" stroke="#d8cfc0" stroke-width="1"/></svg>`;
}

// Batang horizontal sederhana untuk satu nilai terhadap batas (anggaran).
export function budgetBar(spent, budget) {
  const pct = budget ? Math.min(100, (spent / budget) * 100) : 0;
  const over = spent > budget;
  const color = over ? '#c04a3a' : pct > 85 ? '#d96c3f' : '#1e6b4f';
  return `<div class="bar-track"><div class="bar-fill" style="width:${pct.toFixed(1)}%;background:${color}"></div></div>`;
}
