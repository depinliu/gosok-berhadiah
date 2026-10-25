// ====== GANTI DI SINI ======
const CONFIG = {
  friendName: "my beloved bestfriend",
  // Nomor WA tujuan, format internasional tanpa "+" / spasi (contoh: 62878)
  waNumber: "6287825626001",
  waMessage:
    "Haii! 🎁 Aku mau klaim Voucher Buku Rp50.000 dari kado ulang tahunku 📚💕",
  wish:
    "Semoga panjang umur, sehat selalu, makin cantik, makin bahagia, dan semua mimpimu satu per satu jadi nyata 🌷 " +
    "Ini kado kecil dari aku — pakai voucher ini buat beli buku favoritmu ya! 📚💖",
  // Kosongkan = lagu "Happy Birthday" versi kotak musik (otomatis).
  // Mau pakai lagu sendiri? taruh file mp3 di folder ini lalu isi, contoh: "music.mp3"
  music: "",
};
// ===========================

const $ = (id) => document.getElementById(id);

$("friendName").textContent = CONFIG.friendName + "!";
$("wish").textContent = `Hai ${CONFIG.friendName}! ${CONFIG.wish}`;
$("waBtn").href =
  `https://wa.me/${CONFIG.waNumber}?text=${encodeURIComponent(CONFIG.waMessage)}`;

// ---------- ornamen melayang ----------
(function floaties() {
  const items = ["💖", "🎀", "🌸", "⭐", "🎈", "🍰", "✨", "🦋", "💗", "🧁", "🌷", "🍓"];
  const box = $("floaties");
  const count = window.innerWidth < 500 ? 16 : 26;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.textContent = items[i % items.length];
    s.style.left = Math.random() * 100 + "%";
    s.style.fontSize = 16 + Math.random() * 22 + "px";
    s.style.animationDuration = 10 + Math.random() * 12 + "s";
    s.style.animationDelay = -Math.random() * 20 + "s";
    box.appendChild(s);
  }
})();

// ---------- confetti ----------
// bentuk bulat, hati & bintang saja (tanpa kotak) biar lembut
const PINKS = ["#ff74b4", "#f24c9a", "#ffc2e0", "#ffe58a", "#c9a7ff", "#ffffff"];
let SHAPES = ["circle"];
try {
  SHAPES = [
    "circle",
    confetti.shapeFromPath({ path: "M12 21s-7.5-4.6-10-9.3C0.3 8.3 2.2 4 6.3 4c2.3 0 3.9 1.3 5.7 3.3C13.8 5.3 15.4 4 17.7 4c4.1 0 6 4.3 4.3 7.7C19.5 16.4 12 21 12 21z" }),
    confetti.shapeFromPath({ path: "M12 1l2.9 7.1L22 9l-5.5 4.8L18.2 21 12 17.3 5.8 21l1.7-7.2L2 9l7.1-.9z" }),
  ];
} catch (e) {}

const confettiBase = {
  colors: PINKS,
  shapes: SHAPES,
  zIndex: 50,
  disableForReducedMotion: true,
};

// letupan dari tengah (kado/voucher)
function burst(power = 1) {
  if (typeof confetti !== "function") return;
  confetti({
    ...confettiBase,
    particleCount: Math.round(70 * power),
    spread: 100,
    startVelocity: 32,
    gravity: 0.7,
    decay: 0.92,
    scalar: 1.3,
    ticks: 220,
    origin: { x: 0.5, y: 0.45 },
  });
}

// hujan pelan dari atas
function rain(ms = 2500) {
  if (typeof confetti !== "function") return;
  const end = Date.now() + ms;
  (function frame() {
    confetti({
      ...confettiBase,
      particleCount: 1,
      startVelocity: 0,
      gravity: 0.45,
      drift: Math.random() - 0.5,
      scalar: 1 + Math.random() * 0.6,
      ticks: 400,
      origin: { x: Math.random(), y: -0.05 },
    });
    if (Date.now() < end) setTimeout(frame, 60);
  })();
}

// kilauan bintang di layar kado
(function twinkles() {
  const box = $("twinkles");
  for (let i = 0; i < 18; i++) {
    const s = document.createElement("span");
    s.textContent = "✦";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.fontSize = 10 + Math.random() * 18 + "px";
    s.style.animationDuration = 1.8 + Math.random() * 2 + "s";
    s.style.animationDelay = -Math.random() * 3 + "s";
    box.appendChild(s);
  }
})();

// ---------- musik & efek suara ----------
const sound = (() => {
  let ctx, master, audioEl;
  let muted = false;
  let started = false;
  const BEAT = 0.34; // detik per ketukan

  const midi = (s) => {
    const [, n, flat, oct] = /^([A-G])(b?)(\d)$/.exec(s);
    return { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[n] - (flat ? 1 : 0) + (+oct + 1) * 12;
  };
  const hz = (s) => 440 * Math.pow(2, (midi(s) - 69) / 12);

  // Happy Birthday (domain publik), 3/4, tiap birama: [akor, [nada, ketukan]...]
  const SONG = [
    [null, ["C5", 0.75], ["C5", 0.25]],
    [["F2", "A3", "C4", "F4"], ["D5", 1], ["C5", 1], ["F5", 1]],
    [["C3", "G3", "Bb3", "E4"], ["E5", 2], ["C5", 0.75], ["C5", 0.25]],
    [["C3", "G3", "Bb3", "E4"], ["D5", 1], ["C5", 1], ["G5", 1]],
    [["F2", "A3", "C4", "F4"], ["F5", 2], ["C5", 0.75], ["C5", 0.25]],
    [["F2", "A3", "Eb4", "F4"], ["C6", 1], ["A5", 1], ["F5", 1]],
    [["Bb2", "F3", "Bb3", "D4"], ["E5", 1], ["D5", 1], ["Bb5", 0.75], ["Bb5", 0.25]],
    [["C3", "F3", "A3", "C4"], ["A5", 1], ["F5", 1], ["G5", 1]],
    [["F2", "A3", "C4", "F4"], ["F5", 2], [null, 1]],
  ];

  function tone(freq, t, dur, { type = "triangle", vol = 0.2, attack = 0.01 } = {}) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  // satu putaran lagu, lalu jadwalkan putaran berikutnya
  function playLoop(start) {
    let t = start;
    for (const [chord, ...notes] of SONG) {
      const barStart = t;
      for (const [n, beats] of notes) {
        if (n) {
          tone(hz(n), t, beats * BEAT + 0.5, { vol: 0.22 });
          tone(hz(n) * 2, t, 0.35, { type: "sine", vol: 0.05 }); // kilau kotak musik
        }
        t += beats * BEAT;
      }
      if (chord) {
        const [bass, ...triad] = chord;
        // pola "oom-pah-pah"
        tone(hz(bass), barStart, BEAT * 0.9, { type: "sine", vol: 0.22 });
        for (const b of [1, 2]) {
          for (const n of triad) tone(hz(n), barStart + b * BEAT, BEAT * 0.6, { vol: 0.045 });
        }
      }
    }
    setTimeout(function next() {
      // saat musik dimatikan, waktu audio berhenti — tunggu sampai jalan lagi
      if (ctx.state !== "running") return setTimeout(next, 500);
      playLoop(Math.max(t + BEAT, ctx.currentTime + 0.1));
    }, Math.max(0, t - ctx.currentTime - 0.5) * 1000);
  }

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.8;
    master.connect(ctx.destination);
  }

  function start() {
    init();
    if (started) return;
    started = true;
    if (CONFIG.music) {
      audioEl = new Audio(CONFIG.music);
      audioEl.loop = true;
      audioEl.volume = 0.6;
      if (!muted) audioEl.play().catch(() => {});
    } else {
      playLoop(ctx.currentTime + 0.1);
    }
    if (muted) ctx.suspend();
  }

  function toggle() {
    init();
    muted = !muted;
    if (muted) {
      ctx.suspend();
      audioEl && audioEl.pause();
    } else {
      ctx.resume();
      audioEl && audioEl.play().catch(() => {});
      start();
    }
    return muted;
  }

  function pop(i) {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    tone(hz(["E5", "G5", "C6"][i % 3]), t, 0.25, { type: "sine", vol: 0.35 });
  }

  function fanfare() {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    ["C5", "E5", "G5", "C6", "E6"].forEach((n, i) =>
      tone(hz(n), t + i * 0.08, 0.6, { type: "sine", vol: 0.25 })
    );
  }

  return { start, toggle, pop, fanfare };
})();

$("musicBtn").addEventListener("click", () => {
  const muted = sound.toggle();
  $("musicBtn").textContent = muted ? "🔇" : "🎵";
  $("musicBtn").classList.toggle("off", muted);
  $("musicBtn").setAttribute("aria-label", muted ? "Nyalakan musik" : "Matikan musik");
});

// ---------- alur: home -> kado ----------
$("openGift").addEventListener("click", () => {
  sound.start();
  $("stage").hidden = false;
  document.body.style.overflow = "hidden";
  document.body.classList.add("staged");
});

let taps = 0;
const gift = $("gift");
const tapDots = $("taps").children;
const hints = ["Ketuk kadonya 3x! 👆", "Lagi! 🤭", "Sekali lagi!! 😆", "Yeay! 🎉"];

gift.addEventListener("click", () => {
  if (taps >= 3) return;
  taps++;
  tapDots[taps - 1].classList.add("on");
  $("giftHint").textContent = hints[taps];
  if (navigator.vibrate) navigator.vibrate(40);
  sound.pop(taps - 1);

  gift.classList.remove("shake");
  void gift.offsetWidth; // restart animasi
  gift.classList.add("shake");

  if (taps === 3) {
    setTimeout(() => {
      gift.classList.add("open");
      burst(1);
      sound.fanfare();
      setTimeout(showVoucher, 900);
    }, 450);
  }
});

function showVoucher() {
  $("giftScene").hidden = true;
  $("voucherScene").hidden = false;
  setupScratch();
}

// ---------- kartu gosok ----------
function setupScratch() {
  const box = $("scratchBox");
  const canvas = $("scratch");
  const ctx = canvas.getContext("2d");
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const w = box.clientWidth;
  const h = box.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  // lapisan perak-pink
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#e9d9e3");
  g.addColorStop(0.35, "#ffffff");
  g.addColorStop(0.55, "#d9c3d1");
  g.addColorStop(1, "#f4c6dd");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.globalAlpha = 0.35;
  ctx.font = "16px sans-serif";
  for (let y = 14; y < h; y += 26) {
    for (let x = (y / 26) % 2 ? 0 : 13; x < w; x += 26) ctx.fillText("♥", x, y);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#d6317f";
  ctx.font = "700 18px Fredoka, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✨ GOSOK DI SINI ✨", w / 2, h / 2);

  ctx.globalCompositeOperation = "destination-out";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 34;

  let drawing = false;
  let last = null;
  let moves = 0;
  let done = false;

  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  canvas.addEventListener("pointerdown", (e) => {
    drawing = true;
    last = pos(e);
    canvas.setPointerCapture(e.pointerId);
    scratchAt(last, last);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drawing || done) return;
    const p = pos(e);
    scratchAt(last, p);
    last = p;
    if (++moves % 6 === 0) checkProgress();
  });
  const stop = () => {
    drawing = false;
    if (!done) checkProgress();
  };
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);

  function scratchAt(a, b) {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  function checkProgress() {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 16) {
      total++;
      if (data[i] === 0) clear++;
    }
    if (clear / total > 0.5) reveal();
  }

  function reveal() {
    if (done) return;
    done = true;
    box.classList.add("done");
    $("scratchHint").hidden = true;
    burst(1.2);
    rain(2500);
    sound.fanfare();
    if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
    setTimeout(() => {
      $("message").hidden = false;
      $("message").scrollIntoView({ behavior: "smooth", block: "center" });
    }, 700);
  }
}
