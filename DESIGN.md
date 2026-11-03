# DESIGN.md: Panduan Desain TalkToMe

## 1. Identitas & Karakter Brand
- **Nama Produk**: TalkToMe
- **Tujuan**: Platform pendengar dan pendamping cerita yang aman, empatik, tenang, dan bebas stigma.
- **Karakter Visual**: Tenang (Calm), Hangat (Warm), Tepercaya (Trustworthy), Terbuka, Ramah.
- **Dial Antislop**:
  - **ENERGY: 1** (Calm: tidak berteriak, warna sejuk, transisi lembut, menghargai ketenangan mental pengguna).
  - **RHYTHM: 2** (Balanced: komposisi variatif antara hero, grid kartu, blok kutipan, dan formulir, tanpa pengulangan seksi yang monoton).
  - **MOTION: 1** (Subtle: hanya transisi mikro interaktif yang ramah aksesibilitas dan menghormati `prefers-reduced-motion`).

---

## 2. Palet Warna (Color System)
Palet dirancang dengan aturan maksimal 2-3 warna utama + 1 aksen fungsional:
- **Teal Utama (`--teal: #007F88`)**: Warna primer yang tenang dan stabil, mencerminkan ketenangan dan kepedulian.
- **Teal Gelap (`--teal-dark: #005F66`)**: Versi kontras tinggi untuk teks interaktif dan status aktif (lulus rasio WCAG AA > 4.5:1).
- **Navy (`--navy: #002976`)**: Warna sekunder sebagai jangkar tipografi judul dan elemen struktural (header/footer).
- **Aqua Aksen (`--aqua: #9BEBE5`)**: Warna aksen lembut untuk tombol sekunder dan penanda visual hangat.
- **Latar Netral**:
  - Mode Terang: `--off-white: #F7FAFA`, `--white: #FFFFFF`, `--aqua-mist: #F3FCFA`.
  - Mode Gelap: `--bg-dark: #0A192F`, `--surface-dark: #112845`, `--border-dark: #1F3F66`.

---

## 3. Tipografi
- **Font Stack**: `"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif`
- **Alasan**: Font sistem yang cepat dimuat tanpa request jaringan eksternal, sangat terbaca di semua perangkat, netral, dan nyaman di mata pengguna yang sedang mencari dukungan emosional.
- **Hierarki**:
  - H1: Judul halaman utama, empati dan jelas.
  - H2: Pembagi seksi fungsional.
  - H3: Judul kartu fitur/partner.
  - Body: 1rem (16px) dengan `line-height: 1.65` untuk keterbacaan tinggi.

---

## 4. Alasan Keputusan Desain (R-31 Documentation)
- **Mengapa palet Teal & Navy?**
  Kombinasi warna biru-kehijauan secara psikologis memberikan rasa aman, ketenangan, dan profesionalisme medis tanpa kesan dingin rumah sakit.
- **Mengapa tata letak bervariasi (Rhythm 2)?**
  Menghilangkan kebosanan pola AI template standar (Hero -> 3 Kartu -> 3 Kartu) dan memandu pengunjung dari perkenalan, bukti sosial jujur, hingga ajakan bertindak yang ramah.
- **Mengapa border radius medium (0.75rem - 1rem)?**
  Memberikan kesan ramah dan lembut tanpa membuat semua komponen berbentuk pill yang kekanak-kanakan.
- **Mengapa bayangan lembut terukur (Subtle Elevation)?**
  Bayangan digunakan murni untuk membedakan lapisan kartu di atas latar belakang, bukan membuat elemen melayang tanpa tujuan.
