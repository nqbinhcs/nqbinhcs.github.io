(function () {
  "use strict";

  var ME = "Quang-Binh Nguyen";
  var TEASER_DIR = "assets/img/teasers/";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ---------- News ---------- */
  function renderNews() {
    var list = document.getElementById("news-list");
    if (!list || !window.NEWS) return;
    list.innerHTML = window.NEWS.map(function (n) {
      return '<li><time class="news-date">' + esc(n.date) + "</time>" + n.html + "</li>";
    }).join("");

    var scroller = document.getElementById("news-scroll");
    var btn = document.getElementById("news-toggle");
    if (!btn || !scroller) return;
    btn.addEventListener("click", function () {
      var open = scroller.classList.toggle("expanded");
      btn.setAttribute("aria-expanded", String(open));
      btn.querySelector(".label").textContent = open ? "Show less" : "Show all news";
      if (!open) scroller.scrollTop = 0;
    });
  }

  /* ---------- Publications ---------- */
  function authorsHTML(authors) {
    return authors.map(function (a) {
      var name = a.replace(/\*$/, "");
      var star = a.slice(-1) === "*" ? "*" : "";
      var html = esc(name) + star;
      return name === ME ? '<span class="me">' + html + "</span>" : html;
    }).join(", ");
  }

  var AC_FACES = ["front", "back", "left", "right", "top", "bottom"];
  function artcrafterHTML() {
    var box = function (cls) {
      return '<div class="ac-box ' + cls + '">' + AC_FACES.map(function (f) { return '<i class="f-' + f + '"></i>'; }).join("") + "</div>";
    };
    return (
      '<div class="teaser ac" role="img" aria-label="ArtCrafter: from two input images of a fridge (rest and open), it generates an articulated 3D fridge whose two doors swing open on their hinges">' +
        '<div class="ac-inputs">' +
          '<figure class="ac-in rest"><img src="' + TEASER_DIR + 'artcrafter_rest.jpg" alt=""><figcaption>Rest</figcaption></figure>' +
          '<figure class="ac-in open"><img src="' + TEASER_DIR + 'artcrafter_open.jpg" alt=""><figcaption>Open</figcaption></figure>' +
        "</div>" +
        '<div class="ac-arrow" aria-hidden="true"><span>→</span></div>' +
        '<div class="ac-stage" aria-hidden="true"><div class="ac-spin"><div class="ac-fridge">' +
          box("ac-body") +
          '<div class="ac-hinge left">' + box("ac-door left") + "</div>" +
          '<div class="ac-hinge right">' + box("ac-door right") + '<b class="ac-handle"></b></div>' +
        "</div></div><span class=\"ac-shadow\"></span></div>" +
      "</div>"
    );
  }

  function teaserHTML(p) {
    if (p.teaser && p.teaser.kind === "artcrafter") return artcrafterHTML();
    if (p.teaser && p.teaser.img) {
      return '<div class="teaser still"><img src="' + TEASER_DIR + esc(p.teaser.img) + '" alt="' + esc(p.teaser.alt || p.short) + '" loading="lazy"></div>';
    }
    if (!p.teaser) {
      return '<div class="teaser placeholder" aria-hidden="true"><span>' + esc(p.short) + "</span></div>";
    }
    var base = TEASER_DIR + p.teaser;
    return '<div class="teaser"><video muted loop playsinline preload="metadata" poster="' + base + '.jpg"' +
      ' aria-label="' + esc(p.short) + ' demo"><source src="' + base + '.mp4" type="video/mp4"></video></div>';
  }

  function pubHTML(p, full) {
    var links = p.links.map(function (l) {
      if (l.soon) return '<span class="soon" title="Coming soon">' + esc(l.label) + " <small>coming</small></span>";
      return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>";
    }).join("");
    return (
      '<article class="pub reveal' + (full ? " full" : "") + '" id="' + (full ? "" : "pub-") + esc(p.id) + '">' +
        teaserHTML(p) +
        "<div>" +
          '<h3 class="pub-title">' + esc(p.title) + "</h3>" +
          '<p class="pub-authors">' + authorsHTML(p.authors) + "</p>" +
          (full && p.venueFull !== p.venue ? '<p class="venue-full">' + esc(p.venueFull) + "</p>" : "") +
          '<div class="pub-meta">' +
            '<span class="venue' + (p.status === "review" ? " review" : "") + '">' + esc(p.venue) + "</span>" +
            (links ? '<span class="pub-links">' + links + "</span>" : "") +
          "</div>" +
          '<details class="tldr"' + (full ? " open" : "") + "><summary>TL;DR</summary><p>" + esc(p.tldr) + "</p></details>" +
        "</div>" +
      "</article>"
    );
  }

  function renderPubs() {
    var box = document.getElementById("pubs");
    if (!box || !window.PUBS) return;
    var full = box.getAttribute("data-mode") === "full";
    box.innerHTML = window.PUBS.map(function (p) { return pubHTML(p, full); }).join("");
  }

  /* ---------- Teaser videos: play only while visible ---------- */
  function wireVideos() {
    var videos = document.querySelectorAll(".teaser video");
    if (!videos.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      videos.forEach(function (v) {
        v.parentElement.addEventListener("mouseenter", function () { v.play().catch(function () {}); });
        v.parentElement.addEventListener("mouseleave", function () { v.pause(); });
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.play().catch(function () {});
        else e.target.pause();
      });
    }, { threshold: 0.25 });
    videos.forEach(function (v) { io.observe(v); });
  }

  /* ---------- Reveal on scroll ---------- */
  function wireReveal() {
    var items = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Top bar shadow once scrolled ---------- */
  function wireTopbar() {
    var bar = document.querySelector(".topbar");
    if (!bar) return;
    var onScroll = function () { bar.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Open the TL;DR of a publication reached via #anchor */
  function openTarget() {
    var id = location.hash.slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    var d = el.querySelector("details");
    if (d) d.open = true;
    el.classList.add("in");
    el.scrollIntoView();
  }

  document.documentElement.classList.add("js");
  renderNews();
  renderPubs();
  wireVideos();
  wireReveal();
  wireTopbar();
  openTarget();
  window.addEventListener("hashchange", openTarget);

  /* ---------- Email: stored reversed in data attributes so crawlers
     reading the HTML never see a plain address; assembled here ---------- */
  var emailEl = document.getElementById("email-text");
  var email = "";
  if (emailEl) {
    var rev = function (x) { return x.split("").reverse().join(""); };
    email = rev(emailEl.getAttribute("data-u")) + "@" + rev(emailEl.getAttribute("data-d"));
    emailEl.textContent = email;
    document.querySelectorAll(".js-email").forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); location.href = "mailto:" + email; });
    });
  }

  /* ---------- Get in touch: copy email + local time ---------- */
  var copyBtn = document.getElementById("copy-email");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var done = function () {
        copyBtn.textContent = "Copied ✓";
        setTimeout(function () { copyBtn.textContent = "Copy"; }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(email).then(done, function () {});
    });
  }
  var timeEl = document.getElementById("local-time");
  if (timeEl && window.Intl) {
    var fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" });
    var showTime = function () { timeEl.textContent = " · " + fmt.format(new Date()) + " local time"; };
    showTime();
    setInterval(showTime, 30000);
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
