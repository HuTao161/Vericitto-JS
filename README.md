`// Vericitto JS`

Vericitto JS adalah mini UI framework berbasis DSL (Domain Specific Language) yang menggunakan syntax khusus berbentuk custom tag HTML seperti `<v-rct>`. 
Framework ini dirancang untuk membuat komponen UI secara declarative, ringkas, dan mudah digunakan tanpa harus menulis struktur JavaScript yang panjang.
Vericitto JS berfokus pada kesederhanaan dan kejelasan konfigurasi melalui attribute.

Untuk menggunakan Vericitto JS di projectmu, panggil file melalui CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/HuTao161/Vericitto-JS@main/js-framework/public/core/AppWidgets.js"></script>
```

`// Konsep Dasar DSL Vericitto`

Vericitto JS menggunakan syntax khusus / DSL berupa:

`<v-rct>`

Tag ini bukan HTML standar, melainkan custom element yang diproses oleh engine Vericitto.
Semua perilaku dan tampilan komponen dikontrol melalui attribute yang ditulis langsung di dalam tag tersebut.
Pendekatan ini memungkinkan developer untuk mendefinisikan UI hanya dengan konfigurasi, bukan dengan manipulasi DOM manual.

`// CID (Cito ID)`

Vericitto JS menggunakan sistem CID (Cito ID).

CID adalah identifier unik yang berfungsi sebagai:
```console
- Identitas komponen
- Penghubung antara tombol dan modal
- Referensi internal untuk event handling
- Pencegah konflik antar komponen
```

Setiap komponen `<v-rct>` wajib memiliki CID yang unik dalam satu halaman. CID dapat dianggap sebagai “ID internal khusus Vericitto” untuk mengontrol function komponen.

`Contoh`

Komponen: Modal / Pop Up

Salah satu implementasi DSL dalam Vericitto JS adalah komponen Modal / Pop Up.

Modal adalah jendela overlay yang muncul di atas halaman untuk:
```console
- Menampilkan informasi
- Memberikan notifikasi
- Menampilkan pesan penting
- Interaksi singkat dengan pengguna
```

Dengan Vericitto JS, modal dibuat menggunakan satu tag DSL tanpa perlu membuat struktur div manual.

`// Cara Menulis DSL Vericitto (Modal)`

Dalam Vericitto JS, modal terdiri dari beberapa komponen konfigurasi utama, yaitu:

```console
1. cid : Identitas unik komponen (Cito ID). Digunakan untuk mengontrol dan membedakan setiap instance modal.
2. title : Judul utama modal. Berfungsi sebagai heading atau konteks dari isi pop up.
3. content : Isi atau deskripsi yang ditampilkan dalam modal.
4. button-text : Teks tombol yang berfungsi untuk membuka modal.
5. close-type : Menentukan tipe tombol penutup modal.
Tersedia dua pilihan:
- icon
- text
6. button-color : Mengatur warna tombol pembuka.
7. button-text-color : Mengatur warna teks tombol pembuka.
8. title-color : Mengatur warna teks judul modal.
9. content-color : Mengatur warna teks isi modal.
```

`// Contoh Penulisan DSL Vericitto JS`

```html
<v-rct
      cid="modal"
      title="Hello World"
      content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      button-text="Open"
      close-type="icon"
      button-color="red"
      button-text-color="white"
      title-color="black"
      content-color="black">
</v-rct>
```
