
/* ========================================
   THADINGYUT FESTIVAL
   Lava Lamp + Animated Greeting Letters
======================================== */

const canvas = document.querySelector("#lavaCanvas");
const ctx = canvas.getContext("2d");

const glowControl = document.querySelector("#glowControl");
const speedControl = document.querySelector("#speedControl");
const colorControl = document.querySelector("#colorControl");

const glowValue = document.querySelector("#glowValue");
const speedValue = document.querySelector("#speedValue");

const toggleButton = document.querySelector("#toggleButton");
const resetButton = document.querySelector("#resetButton");
const replayButton = document.querySelector("#replayLetters");

const burmeseText = document.querySelector("#burmeseText");
const englishText = document.querySelector("#englishText");

/* Greeting messages */

const burmeseMessage =
  "သီတင်းကျွတ်အခါသမယလေးမှာ\n" +
  "စိတ်၏ချမ်းသာခြင်း၊ ကိုယ်၏ကျန်းမာခြင်းတို့နဲ့\n" +
  "ပြည့်စုံပြီး လိုအင်ဆန္ဒအားလုံး ပြည့်ဝပါစေ။\n" +
  "ချစ်ရတဲ့သူတွေနဲ့အတူ ပျော်ရွှင်စရာအချိန်လေးတွေ\n" +
  "ပိုင်ဆိုင်နိုင်ပါစေ။";

const englishMessage =
  "May this beautiful Thadingyut Festival\n" +
  "bring you happiness, peace, and good health.\n" +
  "May your days be filled with warm memories,\n" +
  "bright hopes, and beautiful moments\n" +
  "with the people you love.";

/* ========================================
   1. LAVA LAMP SETTINGS
======================================== */

let width = 1;
let height = 1;
let running = true;
let lastTime = 0;
let elapsed = 0;

let glow = 0.75;
let speed = 1;
let palette = "lava";

let blobs = [];

const palettes = {
  lava: [
    "#ff260b",
    "#ff4a0d",
    "#ff7b13",
    "#ffbd26"
  ],

  ember: [
    "#a90018",
    "#e51d24",
    "#ff4631",
    "#ff8255"
  ],

  gold: [
    "#ff6a00",
    "#ff9800",
    "#ffd02b",
    "#fff06b"
  ],

  violet: [
    "#9c24ff",
    "#e333b5",
    "#ff526f",
    "#ff9bba"
  ]
};

/* Resize canvas to fit the lamp */

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();

  const dpr = Math.min(
    window.devicePixelRatio || 1,
    2
  );

  width = Math.max(1, rect.width);
  height = Math.max(1, rect.height);

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (blobs.length === 0) {
    blobs = Array.from({ length: 10 }, () => ({
      x: width * (0.3 + Math.random() * 0.4),
      y: Math.random() * height,
      radius: 8 + Math.random() * 13,
      phase: Math.random() * Math.PI * 2,
      drift: 0.4 + Math.random() * 0.8,
      rise: 10 + Math.random() * 12
    }));
  }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* Draw an individual glowing lava blob */

function drawBlob(blob, time) {
  const colors = palettes[palette];

  const x =
    blob.x +
    Math.sin(time * blob.drift + blob.phase) * 9;

  const y =
    ((blob.y - time * blob.rise * speed) %
      (height + 60) + height + 60) %
      (height + 60) - 30;

  const radius =
    blob.radius +
    Math.sin(time * 1.5 + blob.phase) * 3;

  const gradient = ctx.createRadialGradient(
    x - radius * 0.25,
    y - radius * 0.35,
    1,
    x,
    y,
    radius * 1.5
  );

  gradient.addColorStop(0, colors[3]);
  gradient.addColorStop(0.3, colors[2]);
  gradient.addColorStop(0.7, colors[1]);
  gradient.addColorStop(1, colors[0]);

  ctx.save();

  ctx.globalAlpha = 0.7 + glow * 0.3;
  ctx.shadowBlur = 10 + glow * 20;
  ctx.shadowColor = colors[1];
  ctx.fillStyle = gradient;

  ctx.beginPath();

  ctx.ellipse(
    x,
    y,
    radius * (0.85 + Math.sin(time + blob.phase) * 0.1),
    radius * 1.2,
    Math.sin(time + blob.phase) * 0.2,
    0,
    Math.PI * 2
  );

  ctx.fill();
  ctx.restore();
}

/* Main animation loop */

function animate(timestamp) {
  requestAnimationFrame(animate);

  if (!running) return;

  const delta = lastTime
    ? Math.min((timestamp - lastTime) / 1000, 0.05)
    : 0;

  lastTime = timestamp;
  elapsed += delta * speed;

  ctx.clearRect(0, 0, width, height);

  /* Warm light inside the glass */

  const centerGlow = ctx.createRadialGradient(
    width * 0.5,
    height * 0.55,
    2,
    width * 0.5,
    height * 0.55,
    height * 0.5
  );

  centerGlow.addColorStop(
    0,
    `rgba(255, 65, 0, ${0.08 + glow * 0.13})`
  );

  centerGlow.addColorStop(
    1,
    "rgba(255, 20, 0, 0)"
  );

  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, width, height);

  /* Blend the glowing blobs */

  ctx.globalCompositeOperation = "lighter";

  blobs.forEach(blob => {
    drawBlob(blob, elapsed);
  });

  ctx.globalCompositeOperation = "source-over";
}

requestAnimationFrame(animate);

/* ========================================
   2. GLOW INTENSITY
======================================== */

glowControl.addEventListener("input", () => {
  glow = Number(glowControl.value) / 100;

  glowValue.textContent = `${glowControl.value}%`;

  document.documentElement.style.setProperty(
    "--glow",
    glow
  );
});

/* ========================================
   3. ANIMATION SPEED
======================================== */

speedControl.addEventListener("input", () => {
  speed = Number(speedControl.value) / 10;

  speedValue.textContent = `${speed.toFixed(1)}×`;
});

/* ========================================
   4. CHANGE LAVA COLOR
======================================== */

colorControl.addEventListener("change", () => {
  palette = colorControl.value;
});

/* ========================================
   5. PAUSE / RESUME LAMP
======================================== */

toggleButton.addEventListener("click", () => {
  running = !running;

  toggleButton.innerHTML = running
    ? "<span aria-hidden='true'>Ⅱ</span> Pause"
    : "<span aria-hidden='true'>▶</span> Resume";

  toggleButton.setAttribute(
    "aria-pressed",
    String(!running)
  );

  if (running) {
    lastTime = 0;
  }
});

/* ========================================
   6. RESET SETTINGS
======================================== */

resetButton.addEventListener("click", () => {
  glowControl.value = 75;
  speedControl.value = 10;
  colorControl.value = "lava";

  glow = 0.75;
  speed = 1;
  palette = "lava";

  glowValue.textContent = "75%";
  speedValue.textContent = "1.0×";

  document.documentElement.style.setProperty(
    "--glow",
    glow
  );

  if (!running) {
    toggleButton.click();
  }
});

/* ========================================
   7. ANIMATED GREETING LETTERS
======================================== */

let letterTimers = [];

function stopLetterAnimation() {
  letterTimers.forEach(timer => {
    clearTimeout(timer);
  });

  letterTimers = [];
}

/* Type text character by character */

function typeLetter(element, message, delay, startDelay) {
  element.textContent = "";
  element.classList.add("typing");

  const characters = Array.from(message);

  characters.forEach((character, index) => {
    const timer = setTimeout(() => {
      element.textContent += character;

      if (index === characters.length - 1) {
        element.classList.remove("typing");
      }
    }, startDelay + index * delay);

    letterTimers.push(timer);
  });
}

/* Play Burmese first, then English */

function playGreetingLetters() {
  stopLetterAnimation();

  typeLetter(
    burmeseText,
    burmeseMessage,
    65,
    500
  );

  typeLetter(
    englishText,
    englishMessage,
    45,
    1100
  );
}

/* Replay button */

replayButton.addEventListener(
  "click",
  playGreetingLetters
);

/* Start greeting when the page loads */

playGreetingLetters();



/* ========================================
   8. BACKGROUND MUSIC
   Autoplay is attempted immediately. Browsers may
   block audible autoplay until the visitor interacts.
======================================== */

const backgroundMusic = document.querySelector("#backgroundMusic");
const musicToggle = document.querySelector("#musicToggle");
const volumeControl = document.querySelector("#volumeControl");
const volumeValue = document.querySelector("#volumeValue");
const musicStatus = document.querySelector("#musicStatus");

let musicStarted = false;
// Default background-music volume is 50% on every fresh page load.
volumeControl.value = "50";
volumeValue.textContent = "50%";
backgroundMusic.volume = 0.5;

function updateMusicButton() {
  const playing = !backgroundMusic.paused;
  musicToggle.innerHTML = playing
    ? "<span aria-hidden='true'>Ⅱ</span> Pause music"
    : "<span aria-hidden='true'>▶</span> Play music";
  musicToggle.setAttribute("aria-pressed", String(playing));
}

async function tryStartMusic() {
  try {
    await backgroundMusic.play();
    musicStarted = true;
    musicStatus.textContent = "Music is playing and will repeat automatically.";
    updateMusicButton();
  } catch (error) {
    musicStatus.textContent = "Your browser may block sound autoplay. Use Play music once if sound does not start.";
    updateMusicButton();
  }
}

musicToggle.addEventListener("click", async () => {
  if (backgroundMusic.paused) {
    await tryStartMusic();
  } else {
    backgroundMusic.pause();
    musicStatus.textContent = "Music paused.";
    updateMusicButton();
  }
});

volumeControl.addEventListener("input", () => {
  const volume = Number(volumeControl.value);
  backgroundMusic.volume = volume / 100;
  volumeValue.textContent = `${volume}%`;
  backgroundMusic.muted = volume === 0;
});

backgroundMusic.addEventListener("play", updateMusicButton);
backgroundMusic.addEventListener("pause", updateMusicButton);
backgroundMusic.addEventListener("ended", () => {
  // The audio element has loop enabled; this is a defensive fallback.
  backgroundMusic.currentTime = 0;
  backgroundMusic.play().catch(() => {});
});

// Try autoplay immediately, then retry on the visitor's first interaction
// if the browser blocked autoplay. No popup is shown.
tryStartMusic();

const retryMusicOnce = () => {
  if (!musicStarted && backgroundMusic.paused) {
    tryStartMusic();
  }
  window.removeEventListener("pointerdown", retryMusicOnce);
  window.removeEventListener("keydown", retryMusicOnce);
  window.removeEventListener("touchstart", retryMusicOnce);
};

window.addEventListener("pointerdown", retryMusicOnce, { once: true });
window.addEventListener("keydown", retryMusicOnce, { once: true });
window.addEventListener("touchstart", retryMusicOnce, { once: true });
