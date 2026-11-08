/* ===== Flixky — logika aplikasi =====
   Halaman: home (semua) | history (semua film yang pernah dicatat) | wishlist (mau ditonton)
   Sinopsis & catatan hanya tampil di modal detail saat kartu diklik.
   Data: localStorage saat belum login, Firestore (users/{uid}/films) saat login Google.
   SDK Firebase dimuat dinamis di initFirebase() supaya aplikasi tetap jalan
   dalam mode lokal kalau CDN Firebase gagal dimuat. */
const firebaseConfig = {
  apiKey: "AIzaSyB3nCAblXPtdb8866ck4uE-nVih34dGep8",
  authDomain: "flixky-4c54b.firebaseapp.com",
  projectId: "flixky-4c54b",
  storageBucket: "flixky-4c54b.firebasestorage.app",
  messagingSenderId: "917651718655",
  appId: "1:917651718655:web:732b3a15675a4270cee7ca",
  measurementId: "G-XMBQ0RCKT2"
};

const KEY = "cinema-journal-v1";
const $ = id => document.getElementById(id);

/* ===== Bahasa (i18n): kamus string ID/EN =====
   Pilihan disimpan di localStorage (kunci "flixky-lang"), fallback ke "id". */
const LANG_KEY = "flixky-lang";
const I18N = {
  id: {
    docTitle: "Flixky — Catatan Filmku",
    kicker: "KOLEKSI PRIBADI",
    headerSub: "Catatan film yang pernah kutonton — dan yang masih menunggu giliran.",
    loginGoogle: "Login dengan Google",
    logoutTitle: "Keluar",
    logoutBtn: "Logout",
    syncLocal: "Mode lokal · data tersimpan di perangkat ini",
    syncCloud: "Tersinkron ke cloud",
    userFallback: "Pengguna",
    statTotal: "Total Film",
    statWatched: "Sudah Ditonton",
    statWatching: "Sedang Ditonton",
    statWant: "Mau Ditonton",
    statAvg: "Rata-rata Rating",
    navHome: "Beranda",
    navHistory: "Riwayat",
    navWishlist: "Wishlist",
    navAccount: "Akun",
    pageHome: "Beranda",
    pageHistory: "Riwayat Tontonan",
    pageWishlist: "Wishlist",
    pageAccount: "Akun",
    searchPh: "Cari judul / genre...",
    sortNew: "Terbaru Ditambah",
    sortRating: "Rating Tertinggi",
    sortTitle: "Judul A–Z",
    sortYear: "Tahun Terbaru",
    emptyText: "Belum ada film di halaman ini.<br />Tekan tombol + untuk menambahkan.",
    chipAll: "Semua",
    filterGenre: "Filter genre",
    filterToggle: "Filter",
    filterAllGenres: "Semua Genre",
    filterRating: "Filter rating minimum",
    filterAllRatings: "Semua Rating",
    filterRating5: "★5",
    filterRating4: "★4 ke atas",
    filterRating3: "★3 ke atas",
    emptyFilterText: "Tidak ada film yang cocok dengan filter saat ini.",
    resetFilters: "Reset Filter",
    posterPreviewError: "Gambar tidak bisa dimuat — periksa lagi URL-nya ya.",
    cardHint: "Klik untuk lihat detail & sinopsis",
    tapHint: "Ketuk untuk sinopsis ›",
    status_watched: "Sudah Ditonton",
    status_watching: "Sedang Ditonton",
    status_want: "Mau Ditonton",
    formAddTitle: "Tambah ke Koleksi",
    formEditTitle: "Edit Film",
    lblTitle: "Judul Film *",
    phTitle: "cth: Parasite",
    lblYear: "Tahun",
    lblGenre: "Genre",
    lblStatus: "Status",
    optWatched: "Sudah ditonton",
    optWatching: "Sedang ditonton",
    optWant: "Mau ditonton",
    lblDate: "Tanggal Ditonton",
    lblRating: "Rating Kamu",
    lblPoster: "URL Poster (opsional)",
    lblSynopsis: "Sinopsis (opsional)",
    phSynopsis: "Ringkasan cerita filmnya... (muncul pas kartu film diklik)",
    lblNote: "Catatan Pribadi (opsional)",
    phNote: "Kesan singkat, nonton sama siapa, adegan favorit...",
    btnAdd: "+ Tambah Film",
    btnSaveChanges: "Simpan Perubahan",
    btnCancel: "Batal",
    lblSynopsisDetail: "Sinopsis",
    lblNoteDetail: "Catatan Pribadi",
    btnEdit: "Edit",
    btnDelete: "Hapus",
    emptySynopsis: "Belum ada sinopsis untuk film ini.",
    emptyNote: "Belum ada catatan pribadi.",
    actStart: "Mulai Nonton",
    actFinish: "Selesai Nonton",
    actMarkWatching: "Tandai Sedang Ditonton",
    exportBtn: "Ekspor JSON",
    importBtn: "Impor JSON",
    resetBtn: "Reset semua data",
    footerText: "Flixky — dibuat untuk para penikmat film",
    fabTitle: "Tambah film",
    acctProfileTitle: "Profil & Akun",
    acctLocalText: "Kamu belum login. Data film tersimpan lokal di perangkat ini saja — login dengan Google supaya tersinkron ke cloud dan tetap aman kalau kamu ganti perangkat.",
    acctBackupTitle: "Pencadangan",
    acctBackupText: "Ekspor koleksimu ke file JSON sebagai cadangan, atau impor dari file hasil ekspor sebelumnya.",
    acctSettingsTitle: "Pengaturan",
    language: "Bahasa",
    setTheme: "Tema",
    themeDark: "Gelap",
    themeLight: "Terang",
    setDensity: "Tampilan daftar",
    densityComfort: "Nyaman",
    densityCompact: "Padat",
    setSort: "Urutan bawaan",
    setConfirmDelete: "Konfirmasi sebelum hapus",
    aboutText: "Catatan film pribadi — yang sudah ditonton, sedang ditonton, dan yang masih menunggu giliran.",
    aboutVer: "Versi 1.2",
    cloudFail: "Ups, gagal menyimpan ke cloud. Cek koneksi internetmu, lalu coba lagi ya.",
    dupConfirm: "Film \"{title}\"{yearPart} sudah ada di koleksimu. Tetap simpan?",
    setStatusConfirm: "Isi tanggal ditonton dengan tanggal hari ini ({date})?",
    deleteConfirm: "Hapus \"{title}\" dari daftar?",
    resetConfirm: "Hapus SEMUA data dan mulai dari kosong?",
    importBadFile: "File tidak bisa dibaca. Pastikan file-nya JSON hasil ekspor Flixky ya.",
    importBadFormat: "Format file tidak sesuai: isinya harus daftar film.",
    importNone: "Tidak ada data film yang valid di file itu.",
    importConfirm: "Impor {count} film dari file ini?",
    importReplaceConfirm: "Isi file ini mau dipakai bagaimana?\n\"Ganti Semua\" menghapus koleksi sekarang lalu mengisinya dengan isi file. \"Tambah Saja\" menambahkan film dari file ke koleksi yang ada.",
    dlgYes: "Ya",
    dlgReplaceAll: "Ganti Semua",
    dlgAddOnly: "Tambah Saja",
    dlgOk: "OK",
    importSuccess: "Berhasil mengimpor {count} film.",
    loginUnavailable: "Login belum tersedia karena koneksi ke Firebase gagal dimuat. Tenang, aplikasi tetap bisa dipakai dalam mode lokal.",
    loginFailed: "Login gagal. Coba lagi ya."
  },
  en: {
    docTitle: "Flixky — My Movie Journal",
    kicker: "PERSONAL COLLECTION",
    headerSub: "A journal of movies I've watched — and the ones still waiting their turn.",
    loginGoogle: "Sign in with Google",
    logoutTitle: "Sign out",
    logoutBtn: "Log out",
    syncLocal: "Local mode · data stored on this device",
    syncCloud: "Synced to cloud",
    userFallback: "User",
    statTotal: "Total Movies",
    statWatched: "Watched",
    statWatching: "Watching",
    statWant: "To Watch",
    statAvg: "Average Rating",
    navHome: "Home",
    navHistory: "History",
    navWishlist: "Wishlist",
    navAccount: "Account",
    pageHome: "Home",
    pageHistory: "Watch History",
    pageWishlist: "Wishlist",
    pageAccount: "Account",
    searchPh: "Search title / genre...",
    sortNew: "Recently Added",
    sortRating: "Top Rated",
    sortTitle: "Title A–Z",
    sortYear: "Newest Year",
    emptyText: "No movies on this page yet.<br />Tap the + button to add one.",
    chipAll: "All",
    filterGenre: "Genre filter",
    filterToggle: "Filter",
    filterAllGenres: "All Genres",
    filterRating: "Minimum rating filter",
    filterAllRatings: "All Ratings",
    filterRating5: "★5",
    filterRating4: "★4 & up",
    filterRating3: "★3 & up",
    emptyFilterText: "No movies match the current filters.",
    resetFilters: "Reset Filters",
    posterPreviewError: "That image couldn't be loaded — please double-check the URL.",
    cardHint: "Click to see details & synopsis",
    tapHint: "Tap for synopsis ›",
    status_watched: "Watched",
    status_watching: "Watching",
    status_want: "Wishlist",
    formAddTitle: "Add to Collection",
    formEditTitle: "Edit Movie",
    lblTitle: "Movie Title *",
    phTitle: "e.g. Parasite",
    lblYear: "Year",
    lblGenre: "Genre",
    lblStatus: "Status",
    optWatched: "Watched",
    optWatching: "Watching",
    optWant: "To watch",
    lblDate: "Date Watched",
    lblRating: "Your Rating",
    lblPoster: "Poster URL (optional)",
    lblSynopsis: "Synopsis (optional)",
    phSynopsis: "A short summary of the story... (shown when you tap the movie card)",
    lblNote: "Personal Note (optional)",
    phNote: "Quick impressions, who you watched with, favorite scene...",
    btnAdd: "+ Add Movie",
    btnSaveChanges: "Save Changes",
    btnCancel: "Cancel",
    lblSynopsisDetail: "Synopsis",
    lblNoteDetail: "Personal Note",
    btnEdit: "Edit",
    btnDelete: "Delete",
    emptySynopsis: "No synopsis for this movie yet.",
    emptyNote: "No personal note yet.",
    actStart: "Start Watching",
    actFinish: "Finish Watching",
    actMarkWatching: "Mark as Watching",
    exportBtn: "Export JSON",
    importBtn: "Import JSON",
    resetBtn: "Reset all data",
    footerText: "Flixky — made for movie lovers",
    fabTitle: "Add movie",
    acctProfileTitle: "Profile & Account",
    acctLocalText: "You're not signed in. Your movies are stored only on this device — sign in with Google to sync them to the cloud and keep them safe when you switch devices.",
    acctBackupTitle: "Backup",
    acctBackupText: "Export your collection to a JSON file as a backup, or import from a previously exported file.",
    acctSettingsTitle: "Settings",
    language: "Language",
    setTheme: "Theme",
    themeDark: "Dark",
    themeLight: "Light",
    setDensity: "Grid view",
    densityComfort: "Comfortable",
    densityCompact: "Compact",
    setSort: "Default sorting",
    setConfirmDelete: "Confirm before deleting",
    aboutText: "A personal movie journal — what you've watched, what you're watching, and what's still waiting.",
    aboutVer: "Version 1.2",
    cloudFail: "Oops, failed to save to the cloud. Check your internet connection and try again.",
    dupConfirm: "\"{title}\"{yearPart} is already in your collection. Save anyway?",
    setStatusConfirm: "Set the watched date to today ({date})?",
    deleteConfirm: "Remove \"{title}\" from your list?",
    resetConfirm: "Delete ALL data and start from empty?",
    importBadFile: "Couldn't read that file. Make sure it's a JSON file exported from Flixky.",
    importBadFormat: "Invalid file format: it should contain a list of movies.",
    importNone: "No valid movie data in that file.",
    importConfirm: "Import {count} movies from this file?",
    importReplaceConfirm: "How should this file be used?\n\"Replace All\" clears your current collection and fills it with the file's contents. \"Add Only\" adds the file's movies to your existing collection.",
    dlgYes: "Yes",
    dlgReplaceAll: "Replace All",
    dlgAddOnly: "Add Only",
    dlgOk: "OK",
    importSuccess: "Successfully imported {count} movies.",
    loginUnavailable: "Sign-in isn't available because Firebase failed to load. Don't worry, the app still works in local mode.",
    loginFailed: "Sign-in failed. Please try again."
  }
};
let lang = (() => {
  try{ return localStorage.getItem(LANG_KEY) === "en" ? "en" : "id"; }catch(e){ return "id"; }
})();
function t(key, vars){
  let s = (I18N[lang] && I18N[lang][key]) ?? I18N.id[key] ?? key;
  if(vars) for(const k in vars) s = s.replaceAll("{" + k + "}", String(vars[k]));
  return s;
}
function setLang(l){
  lang = l === "en" ? "en" : "id";
  try{ localStorage.setItem(LANG_KEY, lang); }catch(e){}
  applyLang();
}
function statusLabel(s){ return t("status_" + s); }

const PAGES = {
  home:     {titleKey:"pageHome",     match:m => true},
  history:  {titleKey:"pageHistory",  match:m => true},
  wishlist: {titleKey:"pageWishlist", match:m => m.status === "want"},
  account:  {titleKey:"pageAccount",  match:m => false}
};

/* Ikon SVG kecil untuk badge status (pengganti emoji) */
const svgWrap = inner => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
const ICONS = {
  check: svgWrap('<path d="m4.5 12.5 5 5 10-11"/>'),
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5Z"/></svg>',
  bookmark: svgWrap('<path d="M7 4h10v16l-5-3.5L7 20Z"/>')
};
function badgeHTML(m){
  const icon = m.status === "watched" ? ICONS.check : m.status === "watching" ? ICONS.play : ICONS.bookmark;
  return icon + esc(statusLabel(m.status) || "");
}

/* ===== Keadaan aplikasi ===== */
let movies = load();          // daftar yang sedang ditampilkan (lokal atau cloud)
let localMovies = movies;     // salinan data lokal (localStorage)
let page = "home";
let formRating = 0;
let editId = null;
let detailId = null;

/* Keadaan filter (hanya selama sesi berjalan, tidak disimpan) */
let historyChip = "all";  // chips status di Riwayat: all | watched | watching | want
let filterGenre = "";     // "" = semua genre
let filterRating = 0;     // 0 = semua rating; selain itu rating minimum

/* Keadaan Firebase */
let FB = null;                // {authM, fsM, auth, db} bila SDK berhasil dimuat
let currentUser = null;
let unsubFilms = null;
let migrationTried = false;   // migrasi lokal -> cloud hanya sekali per sesi login

function seed(){
  return [
    {id:1, title:"Parasite", year:2019, genre:"Thriller", status:"watched", rating:5, poster:"", watchedDate:"",
     synopsis:"Keluarga Ki-taek yang miskin menyusup satu per satu menjadi pekerja di rumah keluarga Park yang kaya — jadi sopir, guru les, sampai asisten rumah tangga — semuanya dengan kebohongan yang rapi. Tapi satu rahasia di ruang bawah tanah rumah itu mengubah segalanya jadi kacau dan berbahaya.",
     note:"Contoh data — hapus aja. Plot twist-nya gila."},
    {id:2, title:"Spider-Man: Across the Spider-Verse", year:2023, genre:"Animasi", status:"watched", rating:5, poster:"", watchedDate:"",
     synopsis:"Miles Morales terlempar melintasi multiverse dan bertemu tim Spider-Man dari berbagai dimensi. Masalahnya, cara Miles menangani satu peristiwa penting bertabrakan dengan aturan para Spider-Man lain, dan ia harus memilih antara mengikuti aturan atau menyelamatkan orang yang ia sayang.",
     note:"Contoh data. Visualnya beda dari film animasi lain."},
    {id:3, title:"Dune: Part Two", year:2024, genre:"Sci-Fi", status:"want", rating:0, poster:"", watchedDate:"",
     synopsis:"Paul Atreides bersembunyi bersama kaum Fremen di planet gurun Arrakis sambil mempelajari cara hidup mereka dan mengendalikan cacing pasir raksasa. Di tengah perang melawan House Harkonnen, Paul dihadapkan pada pilihan antara cinta dan takdir yang bisa memicu perang suci atas namanya.",
     note:"Contoh data. Katanya wajib nonton di layar besar."}
  ];
}
function load(){
  try{
    const raw = localStorage.getItem(KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return seed();
}
function save(){
  try{ localStorage.setItem(KEY, JSON.stringify(localMovies)); }catch(e){}
}

function starText(r){
  let s = "";
  for(let i = 1; i <= 5; i++) s += i <= r ? "★" : '<span class="off">★</span>';
  return s;
}
function initials(t){ return t.split(" ").slice(0,2).map(w => w[0] || "").join("").toUpperCase(); }
function hue(t){ let h = 0; for(const c of t) h = (h * 31 + c.charCodeAt(0)) % 360; return h; }
function esc(s){
  return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function posterStyle(m){
  return m.poster
    ? `background-image:url('${esc(m.poster)}')`
    : `background:linear-gradient(140deg,hsl(${hue(m.title)},38%,26%),hsl(${(hue(m.title)+50)%360},45%,40%))`;
}
function todayStr(){
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function formatDate(iso){
  try{
    return new Date(iso + "T12:00:00").toLocaleDateString(lang === "en" ? "en-US" : "id-ID", {day:"numeric", month:"long", year:"numeric"});
  }catch(e){ return iso; }
}

/* ===== Genre: daftar umum + genre unik dari koleksi ===== */
const COMMON_GENRES = ["Aksi","Animasi","Biografi","Dokumenter","Drama","Fantasi","Horor",
  "Keluarga","Kejahatan","Komedi","Misteri","Musikal","Perang","Petualangan","Romansa",
  "Sci-Fi","Sejarah","Thriller","Barat"];
function uniqueGenres(){
  // Genre unik dari koleksi; pencocokan tidak peka huruf besar/kecil,
  // ejaan yang dipertahankan adalah kemunculan pertama. Data lama tidak diubah.
  const seen = new Map();
  movies.forEach(m => {
    const g = (m.genre || "").trim();
    if(g && !seen.has(g.toLowerCase())) seen.set(g.toLowerCase(), g);
  });
  return [...seen.values()];
}
function refreshGenreDatalist(){
  const set = new Map();
  COMMON_GENRES.forEach(g => set.set(g.toLowerCase(), g));
  uniqueGenres().forEach(g => { if(!set.has(g.toLowerCase())) set.set(g.toLowerCase(), g); });
  $("genreList").innerHTML = [...set.values()]
    .sort((a,b) => a.localeCompare(b))
    .map(g => `<option value="${esc(g)}"></option>`).join("");
}
function refreshFilterGenre(){
  const genres = uniqueGenres().sort((a,b) => a.localeCompare(b));
  // Pertahankan pilihan bila genrenya masih ada (abaikan huruf besar/kecil)
  const canon = filterGenre
    ? genres.find(g => g.toLowerCase() === filterGenre.toLowerCase())
    : "";
  filterGenre = canon || "";
  const sel = $("filterGenre");
  sel.setAttribute("aria-label", t("filterGenre"));
  $("filterRating").setAttribute("aria-label", t("filterRating"));
  sel.innerHTML = `<option value="">${esc(t("filterAllGenres"))}</option>` +
    genres.map(g => `<option value="${esc(g)}">${esc(g)}</option>`).join("");
  sel.value = filterGenre;
}

/* ===== Lapisan data: lokal (localStorage) atau cloud (Firestore) ===== */
function filmRef(id){
  return FB.fsM.doc(FB.db, "users", currentUser.uid, "films", String(id));
}
function cloudFail(e){
  console.error(e);
  showToast(t("cloudFail"), "error");
}
function addMovie(data){
  const id = Date.now();
  if(currentUser && FB){
    FB.fsM.setDoc(filmRef(id), data).catch(cloudFail);
    // UI diperbarui otomatis lewat onSnapshot
  } else {
    movies.push({id, ...data});
    save(); render();
  }
}
function updateMovie(id, fields){
  const m = movies.find(x => x.id === id);
  if(m) Object.assign(m, fields); // perbarui tampilan seketika
  if(currentUser && FB){
    FB.fsM.updateDoc(filmRef(id), fields).catch(cloudFail);
  } else {
    save();
  }
  render();
}
function deleteMovie(id){
  if(currentUser && FB){
    movies = movies.filter(x => x.id !== id);
    FB.fsM.deleteDoc(filmRef(id)).catch(cloudFail);
    render();
  } else {
    movies = movies.filter(x => x.id !== id);
    save(); render();
  }
}

/* ===== Pengaturan (halaman Akun) =====
   Tema, tampilan daftar, urutan bawaan, dan konfirmasi hapus — semuanya
   tersimpan di localStorage (prefix "flixky-") dan langsung diterapkan. */
const THEME_KEY = "flixky-theme";
const DENSITY_KEY = "flixky-density";
const SORT_KEY = "flixky-sort";
const CONFIRM_DELETE_KEY = "flixky-confirm-delete";
const SORT_VALUES = ["new", "rating", "title", "year"];
function readSetting(key){
  try{ return localStorage.getItem(key); }catch(e){ return null; }
}
function writeSetting(key, val){
  try{ localStorage.setItem(key, val); }catch(e){}
}
let theme = readSetting(THEME_KEY) === "light" ? "light" : "dark";
let density = readSetting(DENSITY_KEY) === "compact" ? "compact" : "comfortable";
let confirmDelete = readSetting(CONFIRM_DELETE_KEY) !== "0"; // bawaan: aktif

function applyTheme(){
  if(theme === "light") document.documentElement.setAttribute("data-theme", "light");
  else document.documentElement.removeAttribute("data-theme");
  document.querySelectorAll("#themeSeg button").forEach(b =>
    b.classList.toggle("active", b.dataset.themeVal === theme));
}
function applyDensity(){
  $("grid").classList.toggle("compact", density === "compact");
  document.querySelectorAll("#densitySeg button").forEach(b =>
    b.classList.toggle("active", b.dataset.densityVal === density));
}
document.querySelectorAll("#themeSeg button").forEach(b =>
  b.addEventListener("click", () => {
    theme = b.dataset.themeVal === "light" ? "light" : "dark";
    writeSetting(THEME_KEY, theme);
    applyTheme();
  }));
document.querySelectorAll("#densitySeg button").forEach(b =>
  b.addEventListener("click", () => {
    density = b.dataset.densityVal === "compact" ? "compact" : "comfortable";
    writeSetting(DENSITY_KEY, density);
    applyDensity();
  }));
$("setSort").addEventListener("change", () => {
  writeSetting(SORT_KEY, $("setSort").value);
  $("sort").value = $("setSort").value; // samakan toolbar, render mengikutinya
  render();
});
$("confirmDeleteToggle").addEventListener("change", e => {
  confirmDelete = e.target.checked;
  writeSetting(CONFIRM_DELETE_KEY, confirmDelete ? "1" : "0");
});
// Terapkan simpanan saat aplikasi dibuka: urutan bawaan + saklar konfirmasi hapus
(() => {
  const savedSort = readSetting(SORT_KEY);
  if(SORT_VALUES.includes(savedSort)) $("sort").value = savedSort;
  $("setSort").value = $("sort").value;
  $("confirmDeleteToggle").checked = confirmDelete;
})();

/* ===== Render daftar ===== */
function render(){
  // Halaman Akun: tampilkan view akun, sembunyikan toolbar/grid/FAB
  if(page === "account"){
    $("accountView").style.display = "";
    $("toolbar").style.display = "none";
    $("statusChips").style.display = "none";
    $("grid").style.display = "none";
    $("empty").style.display = "none";
    $("stats").style.display = "none";
    $("fab").style.display = "none";
    $("pageTitle").textContent = t(PAGES.account.titleKey);
    renderAccount();
    return;
  }
  $("accountView").style.display = "none";
  $("toolbar").style.display = "";
  $("grid").style.display = "";
  $("fab").style.display = "";
  // Chips status hanya untuk halaman Riwayat
  $("statusChips").style.display = page === "history" ? "" : "none";

  // Segarkan saran genre (form) + opsi filter genre mengikuti data terbaru
  refreshGenreDatalist();
  refreshFilterGenre();

  // Satu pipeline penyaringan: halaman + chips status + genre + rating minimum + teks pencarian
  const q = $("search").value.trim().toLowerCase();
  // Titik indikator pada tombol Filter (HP): menyala bila ada filter/pencarian aktif
  $("filterDot").style.display = (filterGenre || filterRating || q) ? "" : "none";
  let list = movies.filter(m =>
    PAGES[page].match(m) &&
    (page !== "history" || historyChip === "all" || m.status === historyChip) &&
    (!filterGenre || (m.genre || "").trim().toLowerCase() === filterGenre.toLowerCase()) &&
    (!filterRating || (m.rating || 0) >= filterRating) &&
    (m.title.toLowerCase().includes(q) || (m.genre || "").toLowerCase().includes(q))
  );
  const by = $("sort").value;
  if(by === "rating") list.sort((a,b) => b.rating - a.rating);
  if(by === "title")  list.sort((a,b) => a.title.localeCompare(b.title));
  if(by === "year")   list.sort((a,b) => (b.year || 0) - (a.year || 0));
  if(by === "new")    list.sort((a,b) => b.id - a.id);

  $("pageTitle").textContent = t(PAGES[page].titleKey);
  $("stats").style.display = page === "home" ? "flex" : "none";

  $("grid").innerHTML = list.map(m => `
    <article class="movie" onclick="openDetail(${m.id})" title="${esc(t("cardHint"))}">
      <div class="poster" style="${posterStyle(m)}">${m.poster ? "" : esc(initials(m.title))}</div>
      <div class="body">
        <h3>${esc(m.title)}</h3>
        <div class="meta">${m.year ? m.year : ""}${m.year && m.genre ? " · " : ""}${esc(m.genre || "")}</div>
        <span class="badge ${m.status}">${badgeHTML(m)}</span>
        ${m.status === "watched" && m.rating > 0 ? `<div class="rating">${starText(m.rating)}</div>` : ""}
        <div class="tap-hint">${esc(t("tapHint"))}</div>
      </div>
    </article>`).join("");

  // Empty-state: pesan khusus + tombol reset bila kosongnya karena filter aktif
  const filtersActive = q !== "" || !!filterGenre || filterRating > 0 ||
    (page === "history" && historyChip !== "all");
  $("empty").style.display = list.length ? "none" : "block";
  if(!list.length){
    $("emptyDefault").style.display = filtersActive ? "none" : "";
    $("emptyFilter").style.display = filtersActive ? "" : "none";
  }

  const watched = movies.filter(m => m.status === "watched");
  const rated = watched.filter(m => m.rating > 0);
  $("stTotal").textContent = movies.length;
  $("stWatched").textContent = watched.length;
  $("stWatching").textContent = movies.filter(m => m.status === "watching").length;
  $("stWant").textContent = movies.filter(m => m.status === "want").length;
  $("stAvg").textContent = rated.length
    ? (rated.reduce((a,m) => a + m.rating, 0) / rated.length).toFixed(1) + " ★"
    : "–";
}

/* ===== Modal umum ===== */
function openModal(id){ $(id).style.display = "flex"; document.body.style.overflow = "hidden"; }
function closeModal(id){ $(id).style.display = "none"; document.body.style.overflow = ""; }
document.querySelectorAll("[data-close]").forEach(b =>
  b.addEventListener("click", () => closeModal(b.dataset.close)));
document.querySelectorAll(".modal-backdrop").forEach(m =>
  m.addEventListener("click", e => { if(e.target === m) closeModal(m.id); }));
document.addEventListener("keydown", e => {
  if(e.key !== "Escape") return;
  // Dialog custom paling atas: Escape berarti batal, modal di belakangnya jangan ikut tertutup
  if($("dlgBackdrop").style.display !== "none"){ settleDialog(dlgDismissValue); return; }
  closeModal("formModal"); closeModal("detailModal");
});

/* ===== Dialog & toast custom (pengganti dialog bawaan browser) =====
   customDialog: modal bergaya Flixky, promise-based, mengembalikan nilai
   tombol yang dipilih; klik di luar kartu / Escape = nilai batal (dismiss).
   customConfirm: varian dua tombol (Batal + aksi) -> Promise<boolean>.
   showToast: kartu pesan kecil di atas navigasi bawah, hilang sendiri. */
let dlgResolve = null;
let dlgDismissValue = null;

function settleDialog(val){
  if(!dlgResolve) return;
  const r = dlgResolve;
  dlgResolve = null;
  dlgDismissValue = null;
  $("dlgBackdrop").style.display = "none";
  // Kembalikan kunci gulir hanya bila tidak ada modal lain yang masih terbuka
  document.body.style.overflow =
    ($("formModal").style.display !== "none" || $("detailModal").style.display !== "none")
      ? "hidden" : "";
  r(val);
}
function customDialog(message, buttons, dismissValue = null){
  return new Promise(resolve => {
    if(dlgResolve){ const r = dlgResolve, dv = dlgDismissValue; dlgResolve = null; r(dv); }
    dlgResolve = resolve;
    dlgDismissValue = dismissValue;
    $("dlgMsg").textContent = message;
    const box = $("dlgActions");
    box.innerHTML = "";
    buttons.forEach(b => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = b.kind === "main" ? "btn-main" : b.kind === "danger" ? "btn-del-big" : "btn-ghost";
      btn.textContent = b.label;
      btn.onclick = () => settleDialog(b.value);
      box.appendChild(btn);
    });
    $("dlgBackdrop").style.display = "flex";
    document.body.style.overflow = "hidden";
  });
}
function customConfirm(message, opts = {}){
  return customDialog(message, [
    {label: t("btnCancel"), value: false, kind: "ghost"},
    {label: opts.okLabel || t("dlgYes"), value: true, kind: opts.danger ? "danger" : "main"}
  ], false);
}
$("dlgBackdrop").addEventListener("click", e => {
  if(e.target === $("dlgBackdrop")) settleDialog(dlgDismissValue);
});

const TOAST_ICONS = {
  success: svgWrap('<path d="m4.5 12.5 5 5 10-11"/>'),
  error: svgWrap('<circle cx="12" cy="12" r="8.5"/><path d="M12 8v5"/><path d="M12 16.5v.01"/>'),
  info: svgWrap('<circle cx="12" cy="12" r="8.5"/><path d="M12 11.5V16"/><path d="M12 7.5v.01"/>')
};
function showToast(msg, type = "info", ms = 3500){
  const el = document.createElement("div");
  el.className = "toast toast-" + type;
  el.innerHTML =
    `<span class="toast-icon">${TOAST_ICONS[type] || TOAST_ICONS.info}</span>` +
    `<span class="toast-msg"></span>` +
    `<button type="button" class="toast-close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`;
  el.querySelector(".toast-msg").textContent = msg;
  $("toastWrap").appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  let gone = false;
  const dismiss = () => {
    if(gone) return;
    gone = true;
    el.classList.remove("show");
    el.classList.add("hide");
    setTimeout(() => el.remove(), 280);
  };
  el.querySelector(".toast-close").onclick = dismiss;
  setTimeout(dismiss, ms);
}

/* ===== Detail film (sinopsis tampil di sini) ===== */
function openDetail(id){
  const m = movies.find(x => x.id === id);
  if(!m) return;
  detailId = id;
  const dp = $("dPoster");
  dp.style.cssText = posterStyle(m);
  dp.textContent = m.poster ? "" : initials(m.title);
  $("dTitle").textContent = m.title;
  $("dMeta").textContent = [m.year, m.genre].filter(Boolean).join(" · ");
  const badge = $("dBadge");
  badge.className = "badge " + m.status;
  badge.innerHTML = badgeHTML(m);
  $("dRating").innerHTML = (m.status === "watched" && m.rating > 0) ? starText(m.rating) : "";
  const showDate = m.status === "watched" && !!m.watchedDate;
  $("dDateLabel").style.display = showDate ? "" : "none";
  $("dDate").style.display = showDate ? "" : "none";
  if(showDate) $("dDate").textContent = formatDate(m.watchedDate);
  const syn = $("dSynopsis");
  syn.textContent = m.synopsis || t("emptySynopsis");
  syn.classList.toggle("empty-text", !m.synopsis);
  const note = $("dNote");
  note.textContent = m.note || t("emptyNote");
  note.classList.toggle("empty-text", !m.note);
  // Tombol cepat ganti status, menyesuaikan status film saat ini
  const row = $("dStatusRow");
  if(m.status === "want"){
    row.innerHTML = `<button class="btn-main btn-with-icon" data-act="watching">${ICONS.play} ${esc(t("actStart"))}</button>`;
  } else if(m.status === "watching"){
    row.innerHTML = `<button class="btn-main btn-with-icon" data-act="watched">${ICONS.check} ${esc(t("actFinish"))}</button>`;
  } else {
    row.innerHTML = `<button class="btn-ghost btn-with-icon" data-act="watching">${ICONS.play} ${esc(t("actMarkWatching"))}</button>`;
  }
  row.querySelectorAll("button").forEach(b => b.onclick = () => setStatus(detailId, b.dataset.act));
  openModal("detailModal");
}
window.openDetail = openDetail; // dipakai atribut onclick pada kartu film

async function setStatus(id, status){
  const m = movies.find(x => x.id === id);
  if(!m) return;
  const updates = {status};
  if(status === "watched"){
    const today = todayStr();
    const ok = await customConfirm(t("setStatusConfirm", {date: formatDate(today)}));
    updates.watchedDate = ok ? today : (m.watchedDate || "");
  } else {
    updates.watchedDate = "";
  }
  updateMovie(id, updates);
  openDetail(id); // segarkan isi modal detail
}
$("dEdit").onclick = () => { closeModal("detailModal"); startEdit(detailId); };
$("dDelete").onclick = () => { closeModal("detailModal"); delMovie(detailId); };

/* ===== Formulir ===== */
function renderStars(){
  $("fStars").innerHTML = [1,2,3,4,5].map(i =>
    `<span data-v="${i}" class="${i <= formRating ? "on" : ""}">★</span>`).join("");
  $("fStars").querySelectorAll("span").forEach(sp => {
    sp.onclick = () => { formRating = (formRating === +sp.dataset.v) ? 0 : +sp.dataset.v; renderStars(); };
  });
}
function syncDateWrap(){
  // Kolom tanggal hanya relevan untuk film yang sudah selesai ditonton
  $("dateWrap").style.display = $("fStatus").value === "watched" ? "" : "none";
}
$("fStatus").addEventListener("change", syncDateWrap);

/* ===== Pratinjau poster di formulir (langsung berubah saat URL diketik/ditempel) ===== */
function updatePosterPreview(){
  const url = $("fPoster").value.trim();
  const title = $("fTitle").value.trim();
  const img = $("ppImg");
  const ini = initials(title);
  $("ppInitials").textContent = ini;
  $("ppInitials").style.display = ini ? "" : "none";
  $("ppIcon").style.display = ini ? "none" : "";
  // Placeholder memakai gradasi + inisial yang sama seperti kartu tanpa poster
  $("posterPreview").style.cssText = posterStyle({title, poster: ""});
  $("posterHint").style.display = "none";
  if(!url){
    img.style.display = "none";
    img.removeAttribute("src");
    return;
  }
  img.onload = () => { img.style.display = "block"; $("posterHint").style.display = "none"; };
  img.onerror = () => { img.style.display = "none"; $("posterHint").style.display = ""; };
  img.src = url;
  // Gambar yang sudah ada di cache browser: onload/onerror bisa tidak sempat terpicu
  if(img.complete && img.src){
    if(img.naturalWidth > 0){ img.style.display = "block"; $("posterHint").style.display = "none"; }
    else { img.style.display = "none"; $("posterHint").style.display = ""; }
  }
}
$("fPoster").addEventListener("input", updatePosterPreview);
$("fTitle").addEventListener("input", updatePosterPreview);

function resetForm(){
  $("form").reset();
  formRating = 0; editId = null;
  renderStars();
  syncDateWrap();
  updatePosterPreview();
  $("formTitle").textContent = t("formAddTitle");
  $("btnSubmit").textContent = t("btnAdd");
}
$("fab").onclick = () => { resetForm(); openModal("formModal"); };

$("form").addEventListener("submit", async e => {
  e.preventDefault();
  const status = $("fStatus").value;
  const data = {
    title: $("fTitle").value.trim(),
    year: +$("fYear").value || null,
    genre: $("fGenre").value.trim(),
    status,
    rating: status === "watched" ? formRating : 0,
    poster: $("fPoster").value.trim(),
    synopsis: $("fSynopsis").value.trim(),
    note: $("fNote").value.trim(),
    watchedDate: status === "watched" ? ($("fDate").value || "") : ""
  };
  if(!data.title) return;
  // Cek judul ganda: judul sama (abaikan huruf besar/kecil) + tahun sama
  const dup = movies.find(m => m.id !== editId &&
    m.title.toLowerCase() === data.title.toLowerCase() &&
    (m.year || null) === (data.year || null));
  if(dup && !(await customConfirm(t("dupConfirm", {title: data.title, yearPart: data.year ? ` (${data.year})` : ""})))) return;

  if(editId){
    updateMovie(editId, data);
  } else {
    addMovie(data);
  }
  closeModal("formModal"); resetForm(); render();
});

function startEdit(id){
  const m = movies.find(x => x.id === id);
  if(!m) return;
  editId = id;
  $("fTitle").value = m.title;
  $("fYear").value = m.year || "";
  $("fGenre").value = m.genre || "";
  $("fStatus").value = m.status;
  $("fDate").value = m.watchedDate || "";
  $("fPoster").value = m.poster || "";
  $("fSynopsis").value = m.synopsis || "";
  $("fNote").value = m.note || "";
  formRating = m.rating || 0;
  renderStars();
  syncDateWrap();
  updatePosterPreview(); // pratinjau langsung terisi dari poster film yang diedit
  $("formTitle").textContent = t("formEditTitle");
  $("btnSubmit").textContent = t("btnSaveChanges");
  openModal("formModal");
}
async function delMovie(id){
  const m = movies.find(x => x.id === id);
  if(!m) return;
  // Pengaturan "Konfirmasi sebelum hapus": nonaktif = hapus langsung tanpa dialog apa pun
  if(confirmDelete &&
      !(await customConfirm(t("deleteConfirm", {title: m.title}), {okLabel: t("btnDelete"), danger: true}))) return;
  deleteMovie(id);
  if(editId === id) resetForm();
  render();
}
$("btnReset").onclick = async () => {
  if(!(await customConfirm(t("resetConfirm"), {okLabel: t("resetBtn"), danger: true}))) return;
  if(currentUser && FB){
    try{
      const batch = FB.fsM.writeBatch(FB.db);
      movies.forEach(m => batch.delete(filmRef(m.id)));
      await batch.commit();
    }catch(e){ cloudFail(e); return; }
  }
  movies = []; localMovies = movies; save(); resetForm(); render();
};

/* ===== Ekspor / impor JSON ===== */
$("btnExport").onclick = () => {
  const blob = new Blob([JSON.stringify(movies, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "flixky-koleksi.json";
  a.click();
  URL.revokeObjectURL(a.href);
};
$("btnImport").onclick = () => $("importFile").click();
$("importFile").addEventListener("change", async e => {
  const file = e.target.files[0];
  e.target.value = ""; // supaya file yang sama bisa dipilih lagi lain kali
  if(!file) return;
  let parsed;
  try{
    parsed = JSON.parse(await file.text());
  }catch(err){
    showToast(t("importBadFile"), "error");
    return;
  }
  if(!Array.isArray(parsed)){ showToast(t("importBadFormat"), "error"); return; }
  // Validasi sederhana + rapikan ke skema data film
  const items = parsed
    .filter(it => it && typeof it.title === "string" && it.title.trim())
    .map((it, i) => ({
      id: Number(it.id) || (Date.now() + i),
      title: it.title.trim(),
      year: +it.year || null,
      genre: String(it.genre || ""),
      status: ["watched", "watching", "want"].includes(it.status) ? it.status : "want",
      rating: Math.min(5, Math.max(0, +it.rating || 0)),
      poster: String(it.poster || ""),
      synopsis: String(it.synopsis || ""),
      note: String(it.note || ""),
      watchedDate: typeof it.watchedDate === "string" ? it.watchedDate : ""
    }));
  if(!items.length){ showToast(t("importNone"), "error"); return; }
  if(!(await customConfirm(t("importConfirm", {count: items.length})))) return;
  // Pilihan mode impor: Ganti Semua / Tambah Saja / Batal (klik di luar = batal)
  const choice = await customDialog(t("importReplaceConfirm"), [
    {label: t("btnCancel"), value: null, kind: "ghost"},
    {label: t("dlgAddOnly"), value: "add", kind: "ghost"},
    {label: t("dlgReplaceAll"), value: "replace", kind: "main"}
  ], null);
  if(choice === null) return;
  applyImport(items, choice === "replace");
});
async function applyImport(items, replace){
  if(currentUser && FB){
    try{
      const batch = FB.fsM.writeBatch(FB.db);
      if(replace) movies.forEach(m => batch.delete(filmRef(m.id)));
      items.forEach((it, i) => {
        const film = replace ? it : {...it, id: Date.now() + i};
        const {id, ...data} = film;
        batch.set(filmRef(id), data);
      });
      await batch.commit();
    }catch(e){ cloudFail(e); return; }
  } else if(replace){
    movies = items; localMovies = movies; save();
  } else {
    items.forEach((it, i) => movies.push({...it, id: Date.now() + i}));
    save();
  }
  render();
  showToast(t("importSuccess", {count: items.length}), "success");
}

/* ===== Navigasi bawah ===== */
document.querySelectorAll(".nav-item").forEach(b => {
  b.onclick = () => {
    document.querySelectorAll(".nav-item").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    page = b.dataset.page;
    window.scrollTo({top: 0, behavior: "smooth"});
    render();
  };
});
$("btnFilter").addEventListener("click", () => $("filterPanel").classList.toggle("open"));
$("search").addEventListener("input", render);
$("sort").addEventListener("change", render);

/* ===== Filter: genre, rating minimum, chips status Riwayat ===== */
$("filterGenre").addEventListener("change", () => { filterGenre = $("filterGenre").value; render(); });
$("filterRating").addEventListener("change", () => { filterRating = +$("filterRating").value || 0; render(); });
document.querySelectorAll("#statusChips .chip").forEach(c =>
  c.addEventListener("click", () => {
    historyChip = c.dataset.chip;
    document.querySelectorAll("#statusChips .chip").forEach(x =>
      x.classList.toggle("active", x === c));
    render();
  }));
$("btnResetFilters").onclick = () => {
  $("search").value = "";
  filterGenre = "";
  filterRating = 0;
  $("filterRating").value = "0";
  historyChip = "all";
  document.querySelectorAll("#statusChips .chip").forEach(x =>
    x.classList.toggle("active", x.dataset.chip === "all"));
  render(); // refreshFilterGenre() di dalam render menyelaraskan select genre ke ""
};
$("sort").addEventListener("change", () => { $("setSort").value = $("sort").value; });

/* ===== Firebase: login Google + sinkron Firestore =====
   Satu fungsi login/logout bersama untuk tombol di header dan di halaman Akun. */
function doLogin(){
  if(!FB){
    showToast(t("loginUnavailable"), "error", 6000);
    return;
  }
  const provider = new FB.authM.GoogleAuthProvider();
  FB.authM.signInWithPopup(FB.auth, provider).catch(err => {
    console.error(err);
    showToast(t("loginFailed") + (err && err.code ? " (" + err.code + ")" : ""), "error", 5000);
  });
}
function doLogout(){
  if(FB) FB.authM.signOut(FB.auth).catch(err => console.error(err));
}
$("btnLoginAcct").onclick = doLogin;
$("btnLogoutAcct").onclick = doLogout;

/* ===== Halaman Akun: profil sesuai status login ===== */
function renderAccount(){
  const loggedIn = !!currentUser;
  $("acctLoggedIn").style.display = loggedIn ? "" : "none";
  $("acctLoggedOut").style.display = loggedIn ? "none" : "";
  if(loggedIn){
    $("acctPhoto").src = currentUser.photoURL || "";
    $("acctName").textContent = currentUser.displayName || t("userFallback");
    $("acctEmail").textContent = currentUser.email || "";
    $("acctStatus").textContent = t("syncCloud");
  }
}

/* ===== Terapkan bahasa ke seluruh UI ===== */
function applyLang(){
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll("[data-i18n-title]").forEach(el => { el.title = t(el.dataset.i18nTitle); });
  document.documentElement.lang = lang;
  document.title = t("docTitle");
  document.querySelectorAll("#langSeg button").forEach(b =>
    b.classList.toggle("active", b.dataset.lang === lang));
  $("formTitle").textContent = editId ? t("formEditTitle") : t("formAddTitle");
  $("btnSubmit").textContent = editId ? t("btnSaveChanges") : t("btnAdd");
  render();
  // Segarkan modal detail yang sedang terbuka supaya ikut berganti bahasa
  if(detailId && $("detailModal").style.display !== "none") openDetail(detailId);
}
document.querySelectorAll("#langSeg button").forEach(b =>
  b.addEventListener("click", () => setLang(b.dataset.lang)));

function subscribeFilms(uid){
  if(unsubFilms) unsubFilms();
  const colRef = FB.fsM.collection(FB.db, "users", uid, "films");
  unsubFilms = FB.fsM.onSnapshot(colRef, snap => {
    // Login pertama: cloud masih kosong (terkonfirmasi dari server) tapi ada data lokal
    // -> unggah semua data lokal ke cloud sekali saja.
    if(snap.empty && !snap.metadata.fromCache && !migrationTried && localMovies.length){
      migrationTried = true;
      uploadLocal(uid);
      return;
    }
    migrationTried = true;
    movies = snap.docs.map(d => ({...d.data(), id: Number(d.id)}));
    render();
  }, err => {
    console.error("Gagal menyinkronkan data dari cloud:", err);
  });
}
async function uploadLocal(uid){
  try{
    const batch = FB.fsM.writeBatch(FB.db);
    localMovies.forEach(m => {
      const {id, ...data} = m;
      batch.set(FB.fsM.doc(FB.db, "users", uid, "films", String(id)), data);
    });
    await batch.commit();
    // Snapshot berikutnya akan menampilkan data cloud hasil unggahan
  }catch(e){
    console.error("Migrasi data lokal ke cloud gagal:", e);
  }
}
function watchAuth(){
  FB.authM.onAuthStateChanged(FB.auth, user => {
    currentUser = user;
    if(user){
      localMovies = movies; // tangkap data lokal terakhir sebelum beralih ke cloud
      renderAccount();
      subscribeFilms(user.uid);
    } else {
      if(unsubFilms){ unsubFilms(); unsubFilms = null; }
      migrationTried = false;
      movies = localMovies;
      renderAccount();
      render();
    }
  });
}
async function initFirebase(){
  const base = "https://www.gstatic.com/firebasejs/10.12.2";
  try{
    // Impor dinamis + batas waktu: kalau CDN gagal/hangat, aplikasi tetap jalan mode lokal
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("firebase-timeout")), 8000));
    const load = (async () => {
      const [appM, authM, fsM] = await Promise.all([
        import(`${base}/firebase-app.js`),
        import(`${base}/firebase-auth.js`),
        import(`${base}/firebase-firestore.js`)
      ]);
      const app = appM.initializeApp(firebaseConfig); // tanpa Analytics
      return {authM, fsM, auth: authM.getAuth(app), db: fsM.getFirestore(app)};
    })();
    FB = await Promise.race([load, timeout]);
    watchAuth();
  }catch(e){
    console.warn("Firebase tidak dapat dimuat — Flixky berjalan dalam mode lokal.", e);
    FB = null;
  }
}

renderStars();
applyTheme();
applyDensity();
applyLang();
initFirebase();

/* ===== PWA: daftarkan service worker (hanya jalan di https / localhost) ===== */
if (
  "serviceWorker" in navigator &&
  (location.protocol === "https:" ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1")
) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .catch((err) => console.warn("Service worker gagal didaftarkan:", err));
  });
}
