/* ============================================================
   Marta Sousa Terapias — symbols.js
   Símbolos de Reiki e de Tarot dos Anjos a flutuar
   suavemente no fundo do site (apenas decoração).

   Símbolos Reiki:  Cho Ku Rei · Sei He Ki · Hon Sha Ze Sho Nen ·
                    Dai Ko Myo · Raku · Enso
   Tarot dos Anjos: anjo · coração alado · trombeta · estrela ·
                    lua e estrela · carta de tarot · pomba · sol

   Respeita "prefers-reduced-motion" (sem animação nesse caso).
   ============================================================ */
(function () {
  "use strict";

  /* Sem animações para quem prefere menos movimento */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  /* ---------- repertório de símbolos (SVG de traço, viewBox 100×100) ---------- */
  var SYMS = [
    /* ----- Reiki ----- */
    { name: "Cho Ku Rei", twinkle: false, art:
      '<path d="M26 16 H62 V52 C62 62 54 72 44 72 C34 72 27 64 27 55 C27 46 34 39 43 39 C49 39 53 43 53 49"/>' },
    { name: "Sei He Ki", twinkle: false, art:
      '<path d="M24 20 H58 C66 20 70 25 70 33"/>' +
      '<path d="M18 52 C28 40 40 40 50 50 C60 60 72 60 82 50"/>' +
      '<path d="M76 80 H42 C34 80 30 75 30 67"/>' },
    { name: "Hon Sha Ze Sho Nen", twinkle: false, art:
      '<path d="M30 22 V78 M50 14 V86 M70 22 V78"/>' +
      '<path d="M20 34 H80 M22 50 H78 M20 66 H80"/>' +
      '<path d="M30 42 H50 M50 58 H70"/>' },
    { name: "Dai Ko Myo", twinkle: false, art:
      '<path d="M32 16 H58 C65 16 68 21 65 27"/>' +
      '<path d="M30 38 C42 29 60 31 63 40 C66 49 54 56 45 51 C40 48 41 41 47 39"/>' +
      '<path d="M50 56 V74 C50 82 43 87 36 83"/>' +
      '<path d="M33 64 H67"/>' },
    { name: "Raku", twinkle: false, art:
      '<path d="M58 12 L42 46 H60 L44 88"/>' },
    { name: "Enso", twinkle: false, art:
      '<path d="M72 28 A30 30 0 1 0 78 62"/>' },

    /* ----- Tarot dos Anjos ----- */
    { name: "Anjo", twinkle: false, art:
      '<circle cx="50" cy="32" r="8"/>' +
      '<path d="M50 42 C46 49 43 58 43 68 L39 84 H61 L57 68 C57 58 54 49 50 42"/>' +
      '<path d="M43 54 C33 46 23 45 16 51 C24 53 31 58 36 65"/>' +
      '<path d="M57 54 C67 46 77 45 84 51 C76 53 69 58 64 65"/>' +
      '<path d="M41 18 C45 13 55 13 59 18"/>' },
    { name: "Coração alado", twinkle: false, art:
      '<path d="M50 78 C36 68 28 58 29 49 C30 42 38 38 44 42 L50 48 L56 42 C62 38 70 42 71 49 C72 58 64 68 50 78 Z"/>' +
      '<path d="M29 50 C21 44 13 43 8 47 C14 50 18 55 20 60"/>' +
      '<path d="M71 50 C79 44 87 43 92 47 C86 50 82 55 80 60"/>' },
    { name: "Trombeta", twinkle: false, art:
      '<path d="M20 42 L56 30 C68 26 78 32 80 42 C78 54 68 64 56 66 L22 56 C16 55 14 43 20 42 Z"/>' +
      '<circle cx="13" cy="49" r="3.2"/>' +
      '<path d="M86 32 C91 38 91 54 86 62"/>' },
    { name: "Estrela", twinkle: true, art:
      '<path d="M50 12 C52 38 56 44 86 50 C56 56 52 62 50 88 C48 62 44 56 14 50 C44 44 48 38 50 12 Z"/>' },
    { name: "Lua e estrela", twinkle: true, art:
      '<path d="M58 18 A30 30 0 1 0 58 82 A23 23 0 1 1 58 18 Z"/>' +
      '<path d="M74 22 L76 28 L82 30 L76 32 L74 38 L72 32 L66 30 L72 28 Z"/>' },
    { name: "Carta de tarot", twinkle: false, art:
      '<rect x="32" y="14" width="36" height="72" rx="6"/>' +
      '<path d="M56 36 A13 13 0 1 0 56 62 A10 10 0 1 1 56 36 Z"/>' +
      '<path d="M42 30 L43.3 33.7 L47 35 L43.3 36.3 L42 40 L40.7 36.3 L37 35 L40.7 33.7 Z"/>' +
      '<path d="M40 74 H60"/>' },
    { name: "Pomba", twinkle: false, art:
      '<path d="M16 60 C24 48 40 40 54 42 C50 31 55 20 66 15 C64 26 70 34 81 36 C73 47 64 66 46 73 C34 76 21 70 16 60 Z"/>' +
      '<path d="M48 52 C54 47 62 45 69 46"/>' },
    { name: "Sol", twinkle: true, art:
      '<circle cx="50" cy="50" r="15"/>' +
      '<path d="M50 20 V27 M50 73 V80 M20 50 H27 M73 50 H80 M29 29 L34 34 M66 66 L71 71 M71 29 L66 34 M34 66 L29 71"/>' }
  ];

  var TONES = ["#A78BFA", "#8B6CF0", "#C4AFF2", "#B79FF3", "#D2C1F5"];

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

  /* ---------- camada de fundo ---------- */
  var layer = document.createElement("div");
  layer.className = "symbol-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.insertBefore(layer, document.body.firstChild);

  function isSmall() {
    return window.matchMedia && window.matchMedia("(max-width: 720px)").matches;
  }

  function maxLive() { return isSmall() ? 7 : 13; }

  function spawn(opts) {
    opts = opts || {};
    if (layer.children.length >= maxLive()) return;

    var small = isSmall();
    var sym = pick(SYMS);
    var dur = rand(26, 48);                 /* segundos a atravessar o ecrã */
    var op = rand(0.07, 0.15) + (sym.twinkle ? 0.03 : 0);
    var size = small ? rand(34, 78) : rand(44, 116);

    var el = document.createElement("div");
    el.className = "sym" + (sym.twinkle ? " sym--tw" : "");
    el.style.left = rand(3, 88) + "vw";
    el.style.color = pick(TONES);
    el.style.setProperty("--dur", dur.toFixed(1) + "s");
    el.style.setProperty("--op", op.toFixed(3));
    el.style.setProperty("--size", size.toFixed(0) + "px");
    el.style.setProperty("--amp", rand(10, 42).toFixed(0) + "px");
    el.style.setProperty("--sway-dur", rand(5, 11).toFixed(1) + "s");
    el.style.setProperty("--tw-dur", rand(2.6, 5).toFixed(1) + "s");
    el.style.setProperty("--r1", rand(-14, 14).toFixed(0) + "deg");
    el.style.setProperty("--r2", rand(-14, 14).toFixed(0) + "deg");

    /* já em voo, para o ecrã não começar vazio */
    if (opts.progress) {
      el.style.animationDelay = "-" + (dur * opts.progress).toFixed(1) + "s";
    }

    var inner = document.createElement("span");
    inner.className = "sym-in";
    inner.innerHTML =
      '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" ' +
      'stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">' +
      sym.art + "</svg>";
    el.appendChild(inner);

    el.addEventListener("animationend", function (e) {
      if (e.animationName === "symRise" && el.parentNode) el.parentNode.removeChild(el);
    });

    layer.appendChild(el);
  }

  /* lote inicial em várias fases da subida */
  var initial = isSmall() ? 4 : 7;
  for (var i = 0; i < initial; i++) {
    spawn({ progress: rand(0.08, 0.8) });
  }

  /* novos símbolos, de quando em quando */
  (function loop() {
    var wait = rand(1500, 3400);
    setTimeout(function () {
      if (!document.hidden) spawn({ progress: 0 });
      loop();
    }, wait);
  })();

  /* pausa quando o separador está escondido (poupa bateria/recursos) */
  document.addEventListener("visibilitychange", function () {
    layer.classList.toggle("sym-paused", document.hidden);
  });
})();
