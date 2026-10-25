// ====== GANTI DI SINI ======
const CONFIG = {
  friendName: "Putri Anjar",
  // Nomor WA tujuan, format internasional tanpa "+" / spasi (contoh: 62878)
  waNumber: "6287825626001",
  waMessage:
    "Haii! 🎁 Aku mau klaim Voucher Buku Rp50.000 dari kado ulang tahunku 📚💕",
  wish:
    "Semoga panjang umur, sehat selalu, makin cantik, makin bahagia, dan semua mimpimu satu per satu jadi nyata 🌷 " +
    "Ini kado kecil dari aku — pakai voucher ini buat beli buku favoritmu ya! 📚💖",
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
const PINKS = ["#ff74b4", "#f24c9a", "#ffc2e0", "#ffe58a", "#c9a7ff", "#9ff0d6", "#ffffff"];
let heartShape;
try {
  heartShape = confetti.shapeFromText({ text: "💖", scalar: 2 });
} catch (e) {}

function burst(power = 1) {
  if (typeof confetti !== "function") return;
  const base = { colors: PINKS, zIndex: 50, disableForReducedMotion: true };
  confetti({ ...base, particleCount: 120 * power, spread: 90, startVelocity: 45, origin: { y: 0.6 } });
  confetti({ ...base, particleCount: 60 * power, angle: 60, spread: 60, origin: { x: 0, y: 0.75 } });
  confetti({ ...base, particleCount: 60 * power, angle: 120, spread: 60, origin: { x: 1, y: 0.75 } });
  if (heartShape) {
    confetti({ ...base, shapes: [heartShape], scalar: 2, particleCount: 18 * power, spread: 100, origin: { y: 0.55 } });
  }
}

function rain(ms = 2500) {
  if (typeof confetti !== "function") return;
  const end = Date.now() + ms;
  (function frame() {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: PINKS, zIndex: 50, disableForReducedMotion: true });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: PINKS, zIndex: 50, disableForReducedMotion: true });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

// ---------- alur: home -> kado ----------
$("openGift").addEventListener("click", () => {
  $("stage").hidden = false;
  document.body.style.overflow = "hidden";
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

  gift.classList.remove("shake");
  void gift.offsetWidth; // restart animasi
  gift.classList.add("shake");

  if (taps === 3) {
    setTimeout(() => {
      gift.classList.add("open");
      burst(1);
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
    if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
    setTimeout(() => {
      $("message").hidden = false;
      $("message").scrollIntoView({ behavior: "smooth", block: "center" });
    }, 700);
  }
}
