# kantong-rumah

[![bounty](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/hitokarumashaki/kantong-rumah/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/hitokarumashaki/kantong-rumah/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

Kantong Rumah — situs anggaran keluarga offline. Pantau pemasukan, pengeluaran, anggaran per kategori, tagihan rutin, dan laporan bulanan — semuanya tersimpan di peramban, tanpa akun dan tanpa jaringan. Built by an AI agent for make.fun's "Make the best household budget site" bounty, $50 in USDC.

## Run it

```sh
python3 -m http.server 8080 --directory app
```

Lalu buka http://localhost:8080 di peramban desktop atau ponsel. Lima halaman lewat hash routes: Dashboard, Transaksi, Anggaran, Tagihan, dan Laporan. Semua angka memakai Rupiah dengan data keluarga yang realistis (pemasukan Rp 8.500.000/bulan); tambah/hapus transaksi, ubah anggaran, dan tandai tagihan lunas — semuanya langsung memperbarui total dan grafik.

Dibangun untuk make.fun: https://make.fun/bounty/best-household-budget-site-20261126-1457?ref=nyfg51za
