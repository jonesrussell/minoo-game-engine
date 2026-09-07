(() => {
  "use strict";
  const $ = (id) => document.getElementById(id),
    sc = $("scene"),
    pc = $("preview"),
    sx = sc.getContext("2d"),
    px = pc.getContext("2d");
  const st = {
    manifest: null,
    images: new Map(),
    selected: null,
    visible: new Map(),
    bounds: false,
    dark: false,
    zoom: false,
    token: 0,
  };
  const ids = ["S01.O1", "S01.O2", "S01.O3", "S01.O4", "S01.O5", "S01.O6"],
    finite = (v) => Number.isFinite(v) && v > 0;
  function msg(t, e = false) {
    $("load-state").textContent = t;
    $("load-state").classList.toggle("error", e);
  }
  function clear() {
    st.manifest = null;
    st.images.clear();
    st.selected = null;
    st.visible.clear();
    $("object-list").replaceChildren();
    $("metadata").replaceChildren();
    $("selected-id").textContent = "None";
    $("layer-count").textContent = "—";
    $("zoom-selected").disabled = true;
    $("preview-bg").disabled = true;
    $("preview-empty").hidden = false;
    sx.clearRect(0, 0, sc.width, sc.height);
    px.clearRect(0, 0, pc.width, pc.height);
  }
  function fail(e) {
    clear();
    $("scene-empty").hidden = false;
    $("scene-empty").textContent = "Assets unavailable · press Retry";
    $("retry").hidden = false;
    msg(`Asset load failed: ${e.message || "unknown error"}`, true);
  }
  function file(f) {
  return typeof f === "string" && /^(?:\.\/)?assets\/[^/]+$/.test(f);
  }
  function validate(d) {
    if (
      !d ||
      !d.stage ||
      !finite(d.stage.width) ||
      !finite(d.stage.height) ||
      !d.background ||
      !file(d.background.file) ||
      !finite(d.background.width) ||
      !finite(d.background.height) ||
      !Array.isArray(d.objects) ||
      d.objects.length !== 6
    )
      throw Error("manifest shape or dimensions invalid");
    const seen = new Set();
    d.objects.forEach((o) => {
      const b = o.bounds;
      if (
        !ids.includes(o.id) ||
        seen.has(o.id) ||
        !file(o.file) ||
        !finite(o.width) ||
        !finite(o.height) ||
        !b ||
        ![b.x, b.y, b.width, b.height].every(Number.isFinite) ||
        b.width <= 0 ||
        b.height <= 0 ||
        b.x < 0 ||
        b.y < 0 ||
        b.x + b.width > d.stage.width ||
        b.y + b.height > d.stage.height
      )
        throw Error(`invalid object ${o.id || "(unknown)"}`);
      seen.add(o.id);
    });
    if (seen.size !== 6)
      throw Error("object IDs must be S01.O1 through S01.O6");
    return d;
  }
  function image(f) {
    return new Promise((ok, no) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = () => no(Error(`could not load ${f}`));
    i.src = f.startsWith("./") ? f : `./${f}`;
    });
  }
  async function load() {
    const token = ++st.token;
    clear();
    $("retry").hidden = true;
    $("scene-empty").hidden = false;
    $("scene-empty").textContent = "Loading complete scene…";
    msg("Loading manifest…");
    try {
      const r = await fetch("./manifest.json", { cache: "no-store" });
      if (!r.ok) throw Error(`manifest returned ${r.status}`);
      const m = validate(await r.json()),
        items = [m.background, ...m.objects],
        pairs = await Promise.all(
          items.map(async (x) => [x.file, await image(x.file)]),
        );
      if (token !== st.token) return;
      pairs.forEach(([f, i], n) => {
        if (
          i.naturalWidth !== items[n].width ||
          i.naturalHeight !== items[n].height
        )
          throw Error(`${f} dimensions do not match manifest`);
      });
      st.manifest = m;
      st.images = new Map(pairs);
      st.visible = new Map(m.objects.map((o) => [o.id, true]));
      st.selected = m.objects[0].id;
      $("layer-count").textContent = "6 objects";
      $("scene-empty").hidden = true;
      select(st.selected);
      msg("All assets loaded · review ready");
    } catch (e) {
      if (token === st.token) fail(e);
    }
  }
  function fit(c, i, x, y, w, h) {
    const q = Math.min(w / i.naturalWidth, h / i.naturalHeight),
      dw = i.naturalWidth * q,
      dh = i.naturalHeight * q;
    c.drawImage(i, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  }
  function overlays(c, o, b) {
    if (!Array.isArray(o.overlay)) return;
    c.save();
    c.fillStyle = "#142536";
    c.strokeStyle = "#142536";
    c.lineWidth = 5;
    o.overlay.forEach((v) => {
      if (
        typeof v.text !== "string" ||
        !Number.isFinite(v.x) ||
        !Number.isFinite(v.y)
      )
        return;
      c.font = `700 ${Math.max(10, (v.size || 0.06) * b.width)}px monospace`;
      const x = b.x + v.x * b.width,
        y = b.y + v.y * b.height;
      c.fillText(v.text, x, y);
      if (v.strike) { c.beginPath(); c.moveTo(x,y-5); c.lineTo(x+c.measureText(v.text).width,y-5); c.lineWidth=2; c.stroke(); }
    });
    c.restore();
  }
  function render() {
    if (!st.manifest) return;
    const s = st.manifest.stage;
    sc.width = s.width;
    sc.height = s.height;
    sx.clearRect(0, 0, s.width, s.height);
    fit(
      sx,
      st.images.get(st.manifest.background.file),
      0,
      0,
      s.width,
      s.height,
    );
    sx.save();
    sx.translate(1040,140); sx.rotate(0.07);
    sx.fillStyle='#142536'; sx.font='bold 46px Georgia';
    sx.fillText('Torrona Haps',0,0);
    sx.restore();
    st.manifest.objects.forEach((o) => {
      if (!st.visible.get(o.id)) return;
      const b = o.bounds;
      fit(sx, st.images.get(o.file), b.x, b.y, b.width, b.height);
      overlays(sx, o, b);
      if (st.bounds) {
        sx.strokeStyle = o.id === st.selected ? "#f4cc5c" : "#d77d5e";
        sx.lineWidth = 5;
        sx.strokeRect(b.x, b.y, b.width, b.height);
      }
    });
    preview();
  }
  function preview() {
    $('preview-wrap').classList.toggle('enlarged', st.zoom);
    $('close-zoom').hidden = !st.zoom;
    pc.width = 700;
    pc.height = 410;
    px.clearRect(0, 0, 700, 410);
    const o = st.manifest?.objects.find((x) => x.id === st.selected);
    if (!o) return;
    const i = st.images.get(o.file),
      p = 24,
      q = Math.min(
        (700 - p * 2) / i.naturalWidth,
        (410 - p * 2) / i.naturalHeight,
      );
    fit(
      px,
      i,
      (700 - i.naturalWidth * q) / 2,
      (410 - i.naturalHeight * q) / 2,
      i.naturalWidth * q,
      i.naturalHeight * q,
    );
  }
  function list() {
    const l = $("object-list");
    l.replaceChildren();
    st.manifest.objects.forEach((o) => {
      const r = document.createElement("div");
      r.className =
        "object-row" +
        (o.id === st.selected ? " selected" : "") +
        (!st.visible.get(o.id) ? " hidden-layer" : "");
      r.setAttribute("role", "option");
      r.setAttribute("aria-selected", o.id === st.selected);
      r.tabIndex = 0;
      const b = document.createElement("button");
      b.className = "layer-toggle";
      b.type = "button";
      b.textContent = st.visible.get(o.id) ? "◉" : "○";
      b.setAttribute(
        "aria-label",
        `${st.visible.get(o.id) ? "Hide" : "Show"} ${o.label || o.id}`,
      );
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        st.visible.set(o.id, !st.visible.get(o.id));
        list();
        render();
      });
      const i = document.createElement("img");
      i.className = "object-swatch";
      i.alt = "";
      i.src = o.file;
      const t = document.createElement("span");
      t.className = "object-label";
      t.textContent = o.label || o.id;
      const id = document.createElement("span");
      id.className = "object-id";
      id.textContent = o.id;
      r.append(b, i, t, id);
      r.onclick = () => select(o.id);
      r.onkeydown = (e) => {
        if (e.target === r && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          select(o.id);
        }
      };
      l.append(r);
    });
  }
  function select(id) {
    if (!st.manifest) return;
    st.selected = id;
    st.zoom = false;
    const o = st.manifest.objects.find((x) => x.id === id);
    $("selected-id").textContent = o.id;
    $("preview-empty").hidden = true;
    $("zoom-selected").disabled = false;
    $("preview-bg").disabled = false;
    const m = $("metadata");
    m.replaceChildren();
    [
      ["Label", o.label || o.id],
      ["File", o.file],
      ["Native size", `${o.width} × ${o.height}`],
      [
        "Scene bounds",
        `${o.bounds.x}, ${o.bounds.y} · ${o.bounds.width} × ${o.bounds.height}`,
      ],
    ].forEach(([k, v]) => {
      const d = document.createElement("dt");
      d.textContent = k;
      const q = document.createElement("dd");
      q.textContent = v;
      m.append(d, q);
    });
    list();
    render();
  }
  $("retry").onclick = load;
  $("bounds-toggle").onclick = () => {
    st.bounds = !st.bounds;
    $("bounds-toggle").setAttribute("aria-pressed", st.bounds);
    $("bounds-toggle").textContent = st.bounds ? "Hide bounds" : "Show bounds";
    render();
  };
  $("reset-view").onclick = () => {
    st.bounds = false;
    st.zoom = false;
    $("bounds-toggle").setAttribute("aria-pressed", "false");
    $("bounds-toggle").textContent = "Show bounds";
    render();
  };
  $("zoom-selected").onclick = () => {
    st.zoom = !st.zoom;
    $("zoom-selected").textContent = st.zoom ? "Fit selected" : "Zoom selected";
    preview();
    if (st.zoom) $('close-zoom').focus();
  };
  function closeZoom() { st.zoom=false; $('zoom-selected').textContent='Zoom selected'; preview(); $('zoom-selected').focus(); }
  $('close-zoom').onclick=closeZoom;
  $("preview-bg").onclick = () => {
    st.dark = !st.dark;
    $("preview-bg").setAttribute("aria-pressed", st.dark);
    $("preview-bg").textContent = st.dark ? "Light backing" : "Dark backing";
    $("preview-wrap").classList.toggle("checker-dark", st.dark);
    $("preview-wrap").classList.toggle("checker-light", !st.dark);
  };
  window.onkeydown = (e) => {
    if (e.key === 'Escape' && st.zoom) closeZoom();
    if (e.altKey && (e.key === "r" || e.key === "R")) load();
  };
  load();
})();
