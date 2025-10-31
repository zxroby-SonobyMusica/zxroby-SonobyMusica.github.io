// assets/app.js
// ————————————————————————————————
// Aman tanpa data/songs.json. Jika nanti file itu ada,
// skrip otomatis memuat dan merender daftar lagunya.
// ————————————————————————————————

const grid   = document.getElementById('grid');     // <div id="grid">
const search = document.getElementById('q');        // <input id="q">
const empty  = document.getElementById('empty');    // <p id="empty">

let songs = [];         // sumber data aktif
let loadedFromJSON = false;

// Placeholder awal (boleh kamu edit teksnya)
const PLACEHOLDER_SONGS = [
  {
    title: "Contoh: Peluklah Dirimu",
    slug:  "peluklah-dirimu",
    lang:  "id",
    spotifyId: "",
    badge: "Soon",
    subtitle: "Halaman lirik segera hadir",
    tags: "contoh demo"
  }
];

function cardHTML(s) {
  return `
    <article class="card">
      ${s.badge ? `<div class="card__badge">${s.badge}</div>` : ""}
      <h3>${s.title}</h3>
      <p>${s.subtitle || "Lirik + arti/terjemahan"}</p>
      <div class="card__actions">
        <a class="btn" href="songs/${s.slug}.html">Baca Lirik</a>
        ${s.spotifyId ? `<a class="btn btn--ghost" target="_blank" rel="noopener" href="https://open.spotify.com/track/${s.spotifyId}">Dengarkan</a>` : ""}
      </div>
    </article>
  `;
}

function render(list = songs) {
  const q = (search?.value || "").toLowerCase().trim();

  const filtered = list.filter(s => {
    const hay = `${s.title} ${s.lang} ${s.tags || ""}`.toLowerCase();
    return hay.includes(q);
  });

  grid.innerHTML = filtered.map(cardHTML).join("");

  if (empty) empty.style.display = filtered.length ? "none" : "block";
}

async function tryLoadJSON() {
  try {
    const res = await fetch("data/songs.json", { cache: "no-store" });
    if (!res.ok) throw new Error("songs.json not found");
    const data = await res.json();

    if (Array.isArray(data) && data.length) {
      songs = data;
      loadedFromJSON = true;
      render();
      return;
    }
    throw new Error("songs.json empty");
  } catch (_) {
    songs = PLACEHOLDER_SONGS;
    loadedFromJSON = false;
    render();
  }
}

function boot() {
  if (!grid) return;

  grid.innerHTML = `
    <article class="card">
      <h3>Menyiapkan daftar lagu…</h3>
      <p class="muted">Jika belum ada file <code>data/songs.json</code>, akan tampil contoh sementara.</p>
    </article>
  `;

  if (search) {
    search.addEventListener("input", () => render());
  }

  tryLoadJSON();
}

boot();
