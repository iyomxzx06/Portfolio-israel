/* ==========================================================
   Israel Ruamar – Portfolio scripts
   ----------------------------------------------------------
   HOW TO ADD YOUR VIDEOS
   Paste a link into the "video" field of any project below.
   These links work:
     • YouTube      https://youtu.be/ID  or  https://www.youtube.com/shorts/ID
     • Google Drive https://drive.google.com/file/d/ID/view   (set sharing to "Anyone with the link")
     • Vimeo        https://vimeo.com/ID
     • TikTok       https://www.tiktok.com/@user/video/ID
     • Canva        https://www.canva.com/design/ID/view      (design must be shared publicly)
     • Your own MP4 file, e.g. "Assets/videos/belt-ad.mp4"
   Leave "video" empty and the card shows a "coming soon" message.
   ========================================================== */

const PROJECTS = [
  // Long-form (16:9)
  { title: "YouTube talking-head edit",   type: "YouTube video",          format: "landscape", thumb: "Assets/project-01.jpg", video: "" },
  { title: "Church anniversary intro",    type: "Title sequence",         format: "landscape", thumb: "Assets/project-02.jpg", video: "" },

  // Short-form (9:16)
  { title: "“Want to make 2025…”",        type: "Motivational reel",      format: "portrait",  thumb: "Assets/project-03.jpg", video: "" },
  { title: "“Lives are set up”",          type: "Speaker highlight",      format: "portrait",  thumb: "Assets/project-04.jpg", video: "" },
  { title: "Everyday carry belt",         type: "E-commerce video ad",    format: "portrait",  thumb: "Assets/project-05.jpg", video: "" },
  { title: "“And we live”",               type: "Drone b-roll reel",      format: "portrait",  thumb: "Assets/project-06.jpg", video: "" },
  { title: "Harvest event recap",         type: "Event recap",            format: "portrait",  thumb: "Assets/project-07.jpg", video: "" },
  { title: "Youth service",               type: "Church reel",            format: "portrait",  thumb: "Assets/project-08.jpg", video: "Assets/videos/israel.mp4" },
  { title: "Sunday worship moments",      type: "Church reel",            format: "portrait",  thumb: "Assets/project-09.jpg", video: "" },
  { title: "Youth celebration 02.15.26",  type: "Event promo",            format: "portrait",  thumb: "Assets/project-10.jpg", video: "" },
];

const CONTACT_EMAIL = "israelruamar420@gmail.com";

/* ---------- Render project cards ---------- */

const PLAY_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 1.5v13L14.5 8z"/></svg>';

function renderProjects() {
  document.querySelectorAll(".grid[data-format]").forEach((grid) => {
    const format = grid.dataset.format;
    const frag = document.createDocumentFragment();

    PROJECTS.forEach((p, index) => {
      if (p.format !== format) return;
      const card = document.createElement("button");
      card.type = "button";
      card.className = "card";
      card.dataset.index = index;
      card.setAttribute("aria-label", `Play ${p.title}, ${p.type}`);
      card.innerHTML = `
        <img src="${p.thumb}" alt="" loading="lazy" width="${format === "portrait" ? 720 : 1280}" height="${format === "portrait" ? 1280 : 720}">
        <span class="card-play">${PLAY_ICON}</span>
        <span class="card-info">
          <span class="card-title"></span>
          <span class="card-type"></span>
        </span>`;
      card.querySelector(".card-title").textContent = p.title;
      card.querySelector(".card-type").textContent = p.type;
      frag.appendChild(card);
    });

    grid.appendChild(frag);
  });
}

/* ---------- Turn a share link into something playable ---------- */

function toPlayable(link) {
  if (!link) return null;
  let u;
  try { u = new URL(link, window.location.href); } catch { return null; }

  const host = u.hostname.replace(/^www\.|^m\./, "");
  const path = u.pathname;

  if (host === "youtu.be") {
    return { kind: "iframe", src: `https://www.youtube.com/embed/${path.slice(1)}?autoplay=1&rel=0` };
  }
  if (host.endsWith("youtube.com")) {
    let id = u.searchParams.get("v");
    if (!id) {
      const m = path.match(/\/(shorts|embed|live)\/([^/?#]+)/);
      if (m) id = m[2];
    }
    if (id) return { kind: "iframe", src: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` };
  }
  if (host === "vimeo.com") {
    const id = path.split("/").filter(Boolean)[0];
    if (id) return { kind: "iframe", src: `https://player.vimeo.com/video/${id}?autoplay=1` };
  }
  if (host === "drive.google.com") {
    const m = path.match(/\/d\/([^/]+)/);
    const id = m ? m[1] : u.searchParams.get("id");
    if (id) return { kind: "iframe", src: `https://drive.google.com/file/d/${id}/preview` };
  }
  if (host.endsWith("tiktok.com")) {
    const m = path.match(/video\/(\d+)/);
    if (m) return { kind: "iframe", src: `https://www.tiktok.com/embed/v2/${m[1]}` };
  }
  if (host.endsWith("canva.com") && path.includes("/design/")) {
    const parts = path.split("/").filter(Boolean); // design / ID / [token] / view
    const base = `/${parts.slice(0, parts.indexOf("view") > -1 ? parts.indexOf("view") : parts.length).join("/")}`;
    return { kind: "iframe", src: `https://www.canva.com${base}/view?embed` };
  }
  if (/\.(mp4|webm|mov|m4v)$/i.test(path)) {
    return { kind: "video", src: u.href };
  }
  // Unknown site: open it in a new tab instead
  return { kind: "external", src: u.href };
}

/* ---------- Video player dialog ---------- */

function setupPlayer() {
  const dialog = document.getElementById("player");
  const stage = dialog.querySelector(".modal-stage");
  const title = dialog.querySelector(".modal-title");
  let lastTrigger = null;

  function open(project, trigger) {
    const playable = toPlayable(project.video);

    if (playable && playable.kind === "external") {
      window.open(playable.src, "_blank", "noopener");
      return;
    }

    lastTrigger = trigger;
    title.textContent = `${project.title} | ${project.type}`;
    dialog.classList.toggle("is-portrait", project.format === "portrait");
    stage.replaceChildren();

    if (!playable) {
      const img = document.createElement("img");
      img.src = project.thumb;
      img.alt = "";
      const empty = document.createElement("div");
      empty.className = "modal-empty";
      empty.innerHTML = `
        <p>The full cut of this video is available on request.</p>
        <a class="btn" href="mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Portfolio: " + project.title)}">Ask for the full video</a>`;
      stage.append(img, empty);
    } else if (playable.kind === "video") {
      const video = document.createElement("video");
      video.src = playable.src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.poster = project.thumb;
      stage.append(video);
    } else {
      const frame = document.createElement("iframe");
      frame.src = playable.src;
      frame.title = project.title;
      frame.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
      frame.allowFullscreen = true;
      stage.append(frame);
    }

    dialog.showModal();
  }

  function close() {
    stage.replaceChildren(); // stops playback
    if (dialog.open) dialog.close();
  }

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".card[data-index]");
    if (card) open(PROJECTS[Number(card.dataset.index)], card);
  });

  dialog.querySelector(".modal-close").addEventListener("click", close);
  dialog.addEventListener("click", (e) => { if (e.target === dialog) close(); }); // backdrop click
  dialog.addEventListener("close", () => {
    stage.replaceChildren();
    if (lastTrigger) lastTrigger.focus();
  });
}

/* ---------- Résumé dialog ---------- */

function setupResume() {
  const dialog = document.getElementById("resume-viewer");
  document.querySelectorAll("[data-open-resume]").forEach((btn) =>
    btn.addEventListener("click", () => dialog.showModal())
  );
  dialog.querySelector(".modal-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
}

/* ---------- Copy email ---------- */

function setupCopy() {
  const status = document.querySelector(".copy-status");
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        status.textContent = "Email copied to clipboard.";
      } catch {
        status.textContent = `Copy failed. The email is ${btn.dataset.copy}`;
      }
      clearTimeout(btn._t);
      btn._t = setTimeout(() => (status.textContent = ""), 3000);
    });
  });
}

/* ---------- Lightning storm (hero) ---------- */

function setupStorm() {
  const canvas = document.querySelector(".storm");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const hero = canvas.parentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let w = 0, h = 0, dpr = 1;
  let bolts = [];
  let flash = 0;
  let running = false;
  let visible = true;
  let timer = null;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth;
    h = hero.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!running) drawFrame();
  }

  // Build a jagged path from (x, y) downward, with random side branches.
  function buildBolt(x, y, length, spread, depth = 0) {
    const segs = [];
    const branches = [];
    const steps = Math.max(8, Math.round(length / 18));
    let px = x, py = y;
    const drift = (Math.random() - 0.5) * spread * 0.6;

    for (let i = 0; i < steps; i++) {
      const nx = px + drift / steps * 4 + (Math.random() - 0.5) * spread / 4;
      const ny = py + length / steps * (0.7 + Math.random() * 0.6);
      segs.push([px, py, nx, ny]);
      if (depth < 2 && Math.random() < (depth === 0 ? 0.16 : 0.08)) {
        branches.push(buildBolt(nx, ny, length * (0.25 + Math.random() * 0.3), spread * 0.8, depth + 1));
      }
      px = nx; py = ny;
    }
    return { segs, branches, width: depth === 0 ? 2.2 : 1.2 - depth * 0.3 };
  }

  function strokeBolt(b, alpha) {
    ctx.beginPath();
    b.segs.forEach(([x1, y1, x2, y2], i) => { if (i === 0) ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); });

    ctx.strokeStyle = `rgba(76, 155, 255, ${alpha * 0.55})`;
    ctx.lineWidth = b.width * 5;
    ctx.shadowColor = "rgba(76, 155, 255, 0.9)";
    ctx.shadowBlur = 28;
    ctx.stroke();

    ctx.strokeStyle = `rgba(235, 245, 255, ${alpha})`;
    ctx.lineWidth = b.width;
    ctx.shadowBlur = 10;
    ctx.stroke();

    b.branches.forEach((br) => strokeBolt(br, alpha * 0.75));
  }

  function drawFrame() {
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // flash lights up the sky
    if (flash > 0.01) {
      const g = ctx.createRadialGradient(w * 0.7, 0, 0, w * 0.7, 0, Math.max(w, h));
      g.addColorStop(0, `rgba(120, 175, 255, ${flash * 0.35})`);
      g.addColorStop(1, "rgba(120, 175, 255, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    bolts.forEach((b) => strokeBolt(b.tree, b.alpha));
    ctx.shadowBlur = 0;
  }

  function strike() {
    // favour the right side on wide screens so text stays readable
    const wide = w > 820;
    const x = wide ? w * (0.5 + Math.random() * 0.48) : w * (0.1 + Math.random() * 0.8);
    bolts.push({
      tree: buildBolt(x, -10, h * (0.55 + Math.random() * 0.45), 120),
      alpha: 1,
      born: performance.now(),
      flicker: Math.random() < 0.6,
    });
    flash = 1;
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  function tick(now) {
    bolts.forEach((b) => {
      const age = now - b.born;
      // quick double flicker, then fade
      let a = Math.max(0, 1 - age / 650);
      if (b.flicker && age > 90 && age < 160) a *= 0.25;
      b.alpha = a;
    });
    bolts = bolts.filter((b) => b.alpha > 0.01);
    flash *= 0.88;
    drawFrame();

    if (bolts.length || flash > 0.01) requestAnimationFrame(tick);
    else running = false;
  }

  function schedule(delay) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (visible && !document.hidden) strike();
      schedule(2600 + Math.random() * 4200);
    }, delay);
  }

  resize();
  window.addEventListener("resize", resize);

  if (reduceMotion) {
    // a single, still bolt so the theme is there without movement
    bolts = [{ tree: buildBolt(w * 0.8, -10, h * 0.8, 120), alpha: 0.5 }];
    drawFrame();
    return;
  }

  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(hero);

  schedule(450); // first strike lands with the page-load entrance
}

/* ---------- Init ---------- */

document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
renderProjects();
setupPlayer();
setupResume();
setupCopy();
setupStorm();
