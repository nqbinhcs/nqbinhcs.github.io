/* ==========================================================================
   Pixel-art story: a home robot learns about a person over five weeks.
   Week 1 observe → Week 3 notice a lasting change → Week 5 help in time.
   Drawn on a 128×72 canvas and scaled up with crisp pixels.
   ========================================================================== */
(function () {
  "use strict";

  var canvas = document.getElementById("story-canvas");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var W = 128, H = 72, FLOOR = 62;
  var PHASE = 6, TOTAL = 18;

  var C = {
    wall: "#F7FAF5", trim: "#E7F0E2", floor: "#E7F0E2", floorLine: "#C7D9C4", board: "#DCE8D8",
    frame: "#C7D9C4", glass: "#EAF3F4", cloud: "#FFFFFF",
    wood: "#C9A77C", woodDark: "#A9855A",
    cup: "#E39B4B", cupDark: "#C27A30",
    hair: "#C9CCC4", hairDark: "#A9ADA4", skin: "#F2C9A0", ink: "#2B352C", mouth: "#C9826F",
    shirt: "#7A9B7A", hem: "#5F7F5F", pants: "#5F6C60",
    white: "#FFFFFF", screen: "#2F4034", eye: "#A8F0BC", body: "#A6BFA2", bodyLight: "#C7D9C4", shine: "#E7F0E2",
    antenna: "#7A9B7A", alert: "#E39B4B",
    heart: "#E0707A", sweat: "#8EC1D6", up: "#4A6A4C", down: "#E39B4B",
    slot: "#C7D9C4", card: "#FFFFFF", cardLine: "#7A9B7A", flash: "#E39B4B", label: "#7A9B7A"
  };

  /* ---------- sprites (one char = one pixel) ---------- */
  var PERSON = [
    "...hhhh...",
    "..hhhhhh..",
    ".hhhhhhhh.",
    ".Hhssssss.",
    ".Hhssksks.",
    "..hssssss.",
    "...ssmss..",
    "....sss...",
    "..gggggg..",
    ".gggggggg.",
    ".gggggggg.",
    ".gggggggg.",
    ".gggggggg.",
    ".gggggggg.",
    ".GGGGGGGG.",
    "..pppppp..",
    "..pppppp..",
    "..pp..pp..",
    "..pp..pp..",
    "..pp..pp..",
    "..pp..pp..",
    "..pp..pp..",
    ".kkk..kkk."
  ];
  var PERSON_MAP = { h: C.hair, H: C.hairDark, s: C.skin, k: C.ink, m: C.mouth, g: C.shirt, G: C.hem, p: C.pants };

  var ROBOT_TOP = [
    "......a.......",
    "......k.......",
    "..kkkkkkkkkk..",
    ".kwwwwwwwwwwk.",
    ".kwddddddddwk.",
    ".kwddddddddwk.",
    ".kwddddddddwk.",
    ".kwwwwwwwwwwk.",
    "..kkkkkkkkkk..",
    "...kbbbbbbk...",
    "..kbllllllbk..",
    "..kblssssblk..",
    "..kbllllllbk..",
    "...kkkkkkkk..."
  ];
  var WHEELS = [
    ["..kkk....kkk..", "..kkk....kkk.."],
    ["..kwk....kwk..", "..kkk....kkk.."]
  ];

  var CUP = ["ooooo.", "oooooO", "oooooO", "ooooo.", ".ooo.."];
  var HEART = [".rr.rr.", "rrrrrrr", "rrrrrrr", ".rrrrr.", "..rrr..", "...r..."];
  var ARROW_UP = [".a.", "aaa", ".a.", ".a.", ".a."];
  var ARROW_DOWN = [".a.", ".a.", ".a.", "aaa", ".a."];
  var CLOUD = ["..www..", ".wwwwww", "wwwwwww"];
  var FONT = {
    M: ["a.a", "aaa", "aaa", "a.a", "a.a"], E: ["aaa", "a..", "aa.", "a..", "aaa"],
    O: ["aaa", "a.a", "a.a", "a.a", "aaa"], R: ["aa.", "a.a", "aa.", "a.a", "a.a"],
    Y: ["a.a", "a.a", ".a.", ".a.", ".a."],
    1: [".a.", "aa.", ".a.", ".a.", "aaa"], 3: ["aaa", "..a", "aaa", "..a", "aaa"], 5: ["aaa", "a..", "aaa", "..a", "aaa"]
  };

  /* ---------- helpers ---------- */
  function rect(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); }
  function sprite(rows, x, y, map, scale) {
    var s = scale || 1;
    for (var r = 0; r < rows.length; r++) {
      for (var c = 0; c < rows[r].length; c++) {
        var col = map[rows[r][c]];
        if (col) rect(x + c * s, y + r * s, s, s, col);
      }
    }
  }
  function text(str, x, y, color) {
    for (var i = 0; i < str.length; i++) sprite(FONT[str[i]], x + i * 4, y, { a: color });
  }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function seg(t, a, b) { return clamp((t - a) / (b - a)); }
  function ease(p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
  function lerp(a, b, p) { return a + (b - a) * p; }

  /* ---------- scene pieces ---------- */
  function room(t, week) {
    rect(0, 0, W, H, C.wall);
    rect(0, FLOOR - 3, W, 3, C.trim);

    // window with a drifting cloud
    rect(4, 10, 22, 21, C.frame);
    rect(5, 11, 20, 19, C.glass);
    ctx.save();
    ctx.beginPath(); ctx.rect(5, 11, 20, 19); ctx.clip();
    sprite(CLOUD, -2 + ((t * 2.2) % 30), 14, { w: C.cloud });
    sprite(CLOUD, -20 + ((t * 1.4) % 42), 21, { w: C.cloud });
    ctx.restore();
    rect(14, 11, 2, 19, C.frame);
    rect(5, 19, 20, 2, C.frame);
    rect(3, 31, 24, 2, C.wood);

    // wall calendar showing the week
    rect(31, 12, 16, 19, C.frame);
    rect(32, 13, 14, 17, C.white);
    rect(32, 13, 14, 4, C.heart);
    sprite(FONT[String(week)], 36, 19, { a: C.ink }, 2);

    // plant
    rect(12, FLOOR - 8, 8, 8, C.wood);
    rect(11, FLOOR - 9, 10, 2, C.woodDark);
    sprite(["..g.g..", ".ggGgg.", "gGggGgg", ".gGgGg.", "..ggg.."], 9, FLOOR - 17,
      { g: C.shirt, G: C.body });

    // floor
    rect(0, FLOOR, W, H - FLOOR, C.floor);
    rect(0, FLOOR, W, 1, C.floorLine);
    for (var x = 6; x < W; x += 20) rect(x, FLOOR + 4, 10, 1, C.board);

    // wall shelf: upper plank at head height, lower at chest height
    [SHELF_TOP, SHELF_LOW].forEach(function (y) {
      rect(SHELF_X, y, 28, 2, C.wood);
      rect(SHELF_X, y + 2, 28, 1, C.woodDark);
      rect(SHELF_X + 12, y + 3, 1, 3, C.woodDark); rect(SHELF_X + 13, y + 3, 1, 2, C.woodDark);
      rect(SHELF_X + 23, y + 3, 1, 3, C.woodDark); rect(SHELF_X + 24, y + 3, 1, 2, C.woodDark);
    });
  }

  function person(px, py, armAngle) {
    sprite(PERSON, px, py, PERSON_MAP);
    // left arm hanging
    rect(px, py + 9, 1, 7, C.shirt);
    rect(px, py + 16, 1, 2, C.skin);
    // right arm (toward the shelf)
    var sx = px + 8.5, sy = py + 9, L = 10;
    for (var i = 0; i <= L; i += 0.5) {
      rect(sx + Math.cos(armAngle) * i, sy + Math.sin(armAngle) * i, 2, 2, i < L - 2 ? C.shirt : C.skin);
    }
  }

  function robot(rx, ry, t, mood, moving) {
    var bob = Math.floor(t * 1.6) % 2;
    var antenna = mood === "alert" ? (Math.floor(t * 8) % 2 ? C.alert : C.white) : C.antenna;
    sprite(ROBOT_TOP, rx, ry + bob, {
      a: antenna, k: C.ink, w: C.white, d: C.screen, b: C.body, l: C.bodyLight, s: C.shine
    });
    var wheel = WHEELS[moving ? Math.floor(t * 10) % 2 : 0];
    sprite(wheel, rx, ry + 14, { k: C.ink, w: C.white });

    // face
    var ey = ry + 4 + bob, look = moving ? 0 : -1;
    var blink = (t % 3.1) < 0.12;
    if (mood === "happy") {
      [rx + 3, rx + 7].forEach(function (ex) {
        rect(ex, ey + 1, 1, 1, C.eye); rect(ex + 1, ey, 1, 1, C.eye); rect(ex + 2, ey + 1, 1, 1, C.eye);
      });
    } else if (blink) {
      rect(rx + 4 + look, ey + 1, 2, 1, C.eye); rect(rx + 8 + look, ey + 1, 2, 1, C.eye);
    } else {
      var h = mood === "alert" ? 3 : 2;
      rect(rx + 4 + look, ey + (h === 3 ? 0 : 1), 2, h, C.eye);
      rect(rx + 8 + look, ey + (h === 3 ? 0 : 1), 2, h, C.eye);
    }
  }

  function robotArm(bx, by, tx, ty) {
    var dx = tx - bx, dy = ty - by, n = Math.max(1, Math.ceil(Math.hypot(dx, dy)));
    for (var i = 0; i <= n; i++) {
      var x = bx + dx * i / n, y = by + dy * i / n;
      rect(x, y, 1, 2, C.ink);
      rect(x, y + 1, 1, 1, C.body);
    }
    rect(tx - 1, ty - 1, 3, 1, C.ink);
    rect(tx - 1, ty + 2, 3, 1, C.ink);
  }

  function bubble(x, y, icon) {
    rect(x + 1, y, 15, 11, C.cardLine);
    rect(x, y + 1, 17, 9, C.cardLine);
    rect(x + 1, y + 1, 15, 9, C.card);
    rect(x + 12, y + 12, 2, 2, C.cardLine);
    rect(x + 14, y + 15, 1, 1, C.cardLine);
    drawIcon(icon, x + 2, y + 3);
  }

  function drawIcon(icon, x, y) {
    if (icon === "heart") { sprite(HEART, x + 2, y - 1, { r: C.heart }); return; }
    sprite(CUP, x, y, { o: C.cup, O: C.cupDark });
    sprite(icon === "up" ? ARROW_UP : ARROW_DOWN, x + 8, y, { a: icon === "up" ? C.up : C.down });
  }

  function memory(t) {
    text("MEMORY", 90, 3, C.label);
    var cards = [
      { at: 4.0, icon: "up" },
      { at: PHASE + 4.2, icon: "down" },
      { at: 2 * PHASE + 4.6, icon: "heart" }
    ];
    cards.forEach(function (c, i) {
      var x = 79 + i * 16, y = 10;
      if (t < c.at) {
        // dashed empty slot
        for (var k = 0; k < 15; k += 2) { rect(x + k, y, 1, 1, C.slot); rect(x + k, y + 10, 1, 1, C.slot); }
        for (var j = 0; j < 11; j += 2) { rect(x, y + j, 1, 1, C.slot); rect(x + 14, y + j, 1, 1, C.slot); }
        return;
      }
      var fresh = t - c.at < 0.5;
      rect(x, y, 15, 11, fresh ? C.flash : C.cardLine);
      rect(x + 1, y + 1, 13, 9, C.card);
      drawIcon(c.icon, x + 1, y + 3);
    });
  }

  /* ---------- one frame at loop time t ---------- */
  var PX = 36, PY = FLOOR - 23, RY = FLOOR - 16;
  var SHELF_X = PX + 10, SHELF_TOP = PY - 1, SHELF_LOW = PY + 11;
  var UP_CUP = { x: PX + 11, y: SHELF_TOP - 5 }, LOW_CUP = { x: PX + 16, y: SHELF_LOW - 5 };
  var R_HOME = 100, R_HELP = 80;
  var DOWN = Math.PI / 2;

  function frame(t) {
    var phase = Math.min(2, Math.floor(t / PHASE)), tl = t - phase * PHASE;
    room(t, [1, 3, 5][phase]);

    var arm = DOWN, tip = 0, rx = R_HOME, mood = "watch", moving = false;
    var cup = { x: UP_CUP.x, y: UP_CUP.y }, bubbleIcon = null, heart = -1, sweat = -1;
    var robotArmTip = null;

    if (phase === 0) {
      var up0 = ease(seg(tl, 0.4, 1.6)), dn0 = ease(seg(tl, 2.4, 3.4));
      arm = lerp(DOWN, -1.24, up0 - dn0 * up0);
      tip = Math.round(up0 * (1 - dn0));
      if (tl > 1.6 && tl < 2.4) cup.y = UP_CUP.y - (Math.floor(tl * 10) % 2);
      if (tl > 1.8 && tl < 4.2) bubbleIcon = "up";
    } else if (phase === 1) {
      var up1 = ease(seg(tl, 0.4, 1.6)), dn1 = ease(seg(tl, 2.8, 3.6));
      arm = lerp(DOWN, -0.62, up1 - dn1 * up1);
      if (tl > 1.6 && tl < 2.8) tip = Math.floor(tl * 5) % 2;
      if (tl > 1.8 && tl < 3.4) sweat = seg(tl, 1.8, 3.4);
      if (tl > 1.8 && tl < 3.4) mood = "alert";
      if (tl > 2.2 && tl < 4.4) bubbleIcon = "down";
    } else {
      rx = Math.round(lerp(R_HOME, R_HELP, ease(seg(tl, 0.3, 1.3))));
      moving = tl > 0.3 && tl < 1.3;
      var base = { x: rx + 1, y: RY + 11 };
      var reach = ease(seg(tl, 1.3, 2.0)), carry = ease(seg(tl, 2.0, 3.0)), back = ease(seg(tl, 3.0, 3.5));
      cup.x = lerp(UP_CUP.x, LOW_CUP.x, carry);
      cup.y = lerp(UP_CUP.y, LOW_CUP.y, carry) - Math.sin(Math.PI * carry) * 5;
      var grab = { x: cup.x + 6, y: cup.y + 2 };
      if (tl > 1.3 && tl < 3.5) {
        var p = tl < 2.0 ? reach : 1 - back;
        robotArmTip = { x: lerp(base.x, grab.x, p), y: lerp(base.y, grab.y, p) };
      }
      var up2 = ease(seg(tl, 3.5, 4.3)), dn2 = ease(seg(tl, 5.0, 5.6));
      arm = lerp(DOWN, -0.05, up2 - dn2 * up2);
      if (tl > 4.1 && tl < 5.7) { heart = seg(tl, 4.1, 5.7); mood = "happy"; }
    }

    sprite(CUP, cup.x, cup.y, { o: C.cup, O: C.cupDark });
    person(PX, PY - tip, arm);
    if (sweat >= 0) {
      var sy = PY - tip + 1 + sweat * 4;
      rect(PX + 10, sy, 1, 1, C.sweat); rect(PX + 10, sy + 1, 2, 2, C.sweat);
    }
    robot(rx, RY, t, mood, moving);
    if (robotArmTip) robotArm(rx + 1, RY + 11, robotArmTip.x, robotArmTip.y);
    if (bubbleIcon) bubble(rx - 4, RY - 17, bubbleIcon);
    if (heart >= 0 && Math.floor(heart * 12) % 4 !== 3) sprite(HEART, PX + 9, PY - 13 - heart * 8, { r: C.heart });
    memory(t);

    // fade between weeks ("time passes")
    var fade = 0;
    if (tl < 0.4) fade = 1 - tl / 0.4;
    if (tl > PHASE - 0.4) fade = (tl - (PHASE - 0.4)) / 0.4;
    if (fade > 0) { ctx.globalAlpha = fade * 0.9; rect(0, 0, W, H, C.wall); ctx.globalAlpha = 1; }
    return { phase: phase, progress: tl / PHASE };
  }

  /* ---------- UI + loop ---------- */
  var captions = [
    "The robot watches and remembers: she reaches the top shelf with ease.",
    "It notices a lasting change, not a passing one: her reach is declining.",
    "It helps before she struggles, moving her cup within reach, and sees that the help was welcome."
  ];
  var steps = document.querySelectorAll("#story-steps button");
  var capEl = document.getElementById("story-caption");
  var playBtn = document.getElementById("story-play");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var PAUSE_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2h3v12H4zM9 2h3v12H9z"/></svg>';
  var PLAY_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2l10 6-10 6z"/></svg>';

  var t = reduce ? 2 * PHASE + 4.8 : 0.4;
  var playing = !reduce, visible = false, last = 0, shownPhase = -1, raf = 0;

  function render() {
    var s = frame(t);
    if (s.phase !== shownPhase) {
      shownPhase = s.phase;
      if (capEl) capEl.textContent = captions[s.phase];
      steps.forEach(function (b, i) { b.classList.toggle("active", i === s.phase); b.setAttribute("aria-pressed", String(i === s.phase)); });
    }
    steps.forEach(function (b, i) { b.style.setProperty("--p", i === s.phase ? (s.progress * 100).toFixed(1) + "%" : "0%"); });
  }

  function tick(now) {
    if (!playing || !visible) { last = 0; raf = 0; return; }
    if (last) t = (t + Math.min(0.1, (now - last) / 1000)) % TOTAL;
    last = now;
    render();
    raf = requestAnimationFrame(tick);
  }
  function start() { if (!raf) raf = requestAnimationFrame(tick); }

  function setPlaying(on) {
    playing = on;
    playBtn.innerHTML = on ? PAUSE_ICON : PLAY_ICON;
    playBtn.setAttribute("aria-label", on ? "Pause animation" : "Play animation");
    playBtn.classList.toggle("show", !on);
    if (on) start();
  }

  playBtn.addEventListener("click", function () { setPlaying(!playing); });
  steps.forEach(function (b) {
    b.addEventListener("click", function () {
      t = Number(b.getAttribute("data-phase")) * PHASE + 0.4;
      render();
      if (!playing && !reduce) setPlaying(true);
    });
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && playing) start();
    }, { threshold: 0.15 }).observe(canvas);
  } else {
    visible = true;
  }

  // lets tooling draw an exact moment: canvas.drawAt(seconds)
  canvas.drawAt = function (s) { t = s % TOTAL; render(); };

  setPlaying(playing);
  render();
})();
