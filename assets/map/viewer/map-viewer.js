/* 雀霸传奇 · 世界地图无极缩放查看器（无依赖）
 * 用法：<div id="map" style="height:80vh"></div>
 *       <script src="map-viewer.js"></script>
 *       QuebaMap.mount(document.getElementById('map'), {base: 'assets/map/viewer/', chapter: 9, lang: 'zh'});
 * 文件：base 下的 layout.json、labels.json、world_ch{N}.jpg、detail_ch{N}.jpg（N 取「不超过 chapter 的最大已有章节」由页面决定后传入）。
 * 地图图片里没有文字；地名由这里叠加（默认关闭：作者 10-15 要求地图上不写地名；labels:true 才显示），字号固定、不随缩放变；放大到一定倍数自动显示更小的地名；互相压住的地名自动让开。
 */
(function () {
  const CSS = `
.qm{position:relative;overflow:hidden;touch-action:none;background:#0b0e1c;cursor:grab;user-select:none;-webkit-user-select:none}
.qm.drag{cursor:grabbing}
.qm-stage{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform}
.qm-stage img{position:absolute;transition:opacity .45s;left:0;top:0;max-width:none;pointer-events:none;-webkit-user-drag:none}
.qm-labels{position:absolute;inset:0;pointer-events:none}
.qm-l{position:absolute;white-space:nowrap;color:#fffaf0;font-family:"Noto Serif SC","Noto Serif JP","Noto Serif KR","Songti SC",serif;font-weight:700;letter-spacing:.14em;
 text-shadow:0 0 2px rgba(0,0,0,.95),0 0 4px rgba(0,0,0,.85),0 1px 6px rgba(0,0,0,.7),0 0 14px rgba(0,0,0,.35);line-height:1;opacity:0}
.qm-l.place::before{content:"";position:absolute;width:6px;height:6px;border-radius:50%;background:#fff;box-shadow:0 0 0 1.5px rgba(0,0,0,.45),0 0 8px rgba(255,255,255,.8)}
.qm-l.realm{font-size:26px;letter-spacing:.5em;opacity:.85}
.qm-l.region{font-size:15px;letter-spacing:.32em;font-weight:500;color:#f5f1e6;font-style:normal}
.qm-l.lv1{font-size:20px}.qm-l.lv2{font-size:15px}.qm-l.lv3{font-size:13px}
@media (max-width:600px){.qm-l.lv1{font-size:17px}.qm-l.lv2{font-size:13.5px}.qm-l.region{font-size:13px}}
.qm-ui{position:absolute;right:10px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:6px}
.qm-spot{position:absolute;pointer-events:none;transition:opacity .3s}
.qm-ui button{width:38px;height:38px;border-radius:8px;border:1px solid #b08a42;background:rgba(10,13,32,.85);color:#f1d48a;font-size:20px;line-height:1;cursor:pointer}
.qm-compass{position:absolute;right:12px;top:12px;width:44px;height:44px;opacity:.9;pointer-events:none}
.qm-hint{position:absolute;left:50%;bottom:16%;transform:translateX(-50%);white-space:nowrap;font-size:12px;color:#d9c08a;background:rgba(10,13,32,.7);padding:4px 8px;border-radius:6px;pointer-events:none;transition:opacity .6s}
`;
  const HINT = {zh: '拖动地图；滚轮或双指缩放', en: 'Drag to pan · scroll or pinch to zoom', ja: 'ドラッグで移動・ホイール／ピンチで拡大', ko: '드래그로 이동 · 휠/두 손가락으로 확대'};
  const COMPASS = {zh: '北', en: 'N', ja: '北', ko: '북'};

  function mount(el, opt) {
    if (!document.getElementById('qm-css')) { const s = document.createElement('style'); s.id = 'qm-css'; s.textContent = CSS; document.head.appendChild(s); }
    const base = opt.base || '', N = opt.chapter, lang = opt.lang || 'zh', textOf = opt.text || (t => t[lang] || t.zh);
    el.classList.add('qm'); el.innerHTML = '';
    const stage = document.createElement('div'); stage.className = 'qm-stage';
    const world = new Image(), detail = new Image(); detail.onload = () => draw();
    world.src = base + `world_ch${N}.jpg`; world.alt = opt.alt || '';
    const spot = document.createElement('div'); spot.className = 'qm-spot';
    stage.appendChild(world); stage.appendChild(detail); stage.appendChild(spot); el.appendChild(stage);
    const layer = document.createElement('div'); layer.className = 'qm-labels'; el.appendChild(layer);
    el.insertAdjacentHTML('beforeend', `<svg class="qm-compass" viewBox="0 0 44 44"><circle cx="22" cy="24" r="15" fill="none" stroke="#e8c675" stroke-width="1.5"/><path d="M22 6 L25 24 L22 40 L19 24Z" fill="#f2d48a"/><text x="22" y="9" text-anchor="middle" font-size="9" fill="#f6dc9a" font-weight="700">${COMPASS[lang] || 'N'}</text></svg>
`);
    const hint = {style: {}};   // 作者 10-15：「缩放的说明文字不要」——不再显示操作提示

    let L, LB, W, H, s, x, y, fitS, detailOn = false, nodes = [], mode = 'world', anim = 0;
    const vw = () => el.clientWidth, vh = () => el.clientHeight;
    function fit() { mode = 'world'; fitS = Math.min(vw() / W, vh() / H); s = fitS; x = (vw() - W * s) / 2; y = (vh() - H * s) / 2; }
    function clamp() {
      s = Math.max(fitS, Math.min(Math.max(fitS * 1.5, 1.6), s));
      const sw = W * s, sh = H * s;
      x = sw <= vw() ? (vw() - sw) / 2 : Math.min(0, Math.max(vw() - sw, x));
      y = sh <= vh() ? (vh() - sh) / 2 : Math.min(0, Math.max(vh() - sh, y));
      if (L && L.detail_rect && mode === 'detail' && !anim) {   // 细图模式：细图始终铺满整个容器（不留黑边），拖动不出细图
        const r = L.detail_rect, cs = coverS();
        if (s < cs) { const cx = vw() / 2, cy = vh() / 2; x = cx - (cx - x) * cs / s; y = cy - (cy - y) * cs / s; s = cs; }
        const dx0 = r[0] * W * s, dx1 = r[2] * W * s, dy0 = r[1] * H * s, dy1 = r[3] * H * s;
        x = Math.min(-dx0, Math.max(vw() - dx1, x)); y = Math.min(-dy0, Math.max(vh() - dy1, y));
      }
    }
    function coverS() { const r = L.detail_rect; return Math.max(vw() / ((r[2] - r[0]) * W), vh() / ((r[3] - r[1]) * H)); }
    function zoomAt(f, cx, cy) {
      if (L && L.detail_rect && mode === 'detail' && f < 1 && s <= coverS() * 1.001) { mode = 'world'; f = 0.55; }   // 细图已到最小还在缩小 → 退回全图
      const ns = Math.max(fitS, Math.min(Math.max(fitS * 1.5, 1.6), s * f)); x = cx - (cx - x) * ns / s; y = cy - (cy - y) * ns / s; s = ns; draw();
    }
    function animateTo(ts, cx, cy) {   // 平滑缩放到 ts，保持屏幕上 (cx,cy) 不动
      const s0 = s, x0 = x, y0 = y, t0 = performance.now(), D = 380; anim = 1;
      const step = t => { const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3), ns = s0 * Math.pow(ts / s0, e);
        x = cx - (cx - x0) * ns / s0; y = cy - (cy - y0) * ns / s0; s = ns; render(); if (k < 1) requestAnimationFrame(step); else { anim = 0; draw(); } };
      requestAnimationFrame(step);
    }
    let raf = 0; function draw() { if (!W) return; if (document.hidden) { render(); return; } if (!raf) raf = requestAnimationFrame(() => { raf = 0; render(); }); }
    function measure() { if (!vw()) return; for (const n of nodes) { n.w = n.el.offsetWidth; n.h = n.el.offsetHeight; } }
    function render() {
      clamp();
      stage.style.transform = `translate(${x}px,${y}px) scale(${s})`;
      const z = s / fitS;
      spot.style.opacity = 0;   // 不再压暗细图以外（会显出一个方框，官网 10-15 反馈）
      // 两张图画法、比例不同，不能同时露出（会像贴了一块方形）：细图铺满屏幕时整屏切到细图，缩小回去再切回全图
      if (L.detail_rect) {
      const r0 = L.detail_rect, dw = (r0[2] - r0[0]) * W * s, dh = (r0[3] - r0[1]) * H * s;
      const cover = Math.max(dw / vw(), dh / vh());     // 细图在一个方向上铺满屏幕就切换（另一方向不足时两边留深色底）
      if (!detailOn && cover > 0.35) { detailOn = true; detail.src = base + `detail_ch${N}.jpg`; }
      const ready = detail.complete && detail.naturalWidth > 0;
      if (mode === 'world' && !anim && ready && cover >= 0.6) {     // 进入细图：平滑放大到细图铺满整个容器
        const r = L.detail_rect, cx = x + (r[0] + r[2]) / 2 * W * s, cy = y + (r[1] + r[3]) / 2 * H * s;
        const tx = Math.min(vw() - 1, Math.max(1, cx)), ty = Math.min(vh() - 1, Math.max(1, cy));
        mode = 'detail'; animateTo(coverS(), tx, ty);
      }
      const inDetail = mode === 'detail' && ready;
      detail.style.opacity = inDetail ? 1 : 0; world.style.opacity = inDetail ? 0 : 1;
      }
      // 地名：按层级与缩放显示；互相压住的让开（层级高的优先）
      const placed = [];
      for (const n of nodes) {
        const lv = n.d.level;
        let show = lv === 0 ? z < 7 : lv === 1 ? true : lv === 2 ? z >= 3.2 : z >= 6;
        const px = x + n.d.x * W * s, py = y + n.d.y * H * s;
        if (show && (px < 4 || px > vw() - 4 || py < 4 || py > vh() - 4)) show = false;     // 点在屏幕外的不显示
        let box = null;
        if (show) {
          const w = n.w, h = n.h, a = n.d.anchor || 'mm';
          let lx = a[0] === 'l' ? px + 8 : a[0] === 'r' ? px - 8 - w : px - w / 2;
          let ly = a[1] === 's' ? py - h - 2 : py - h / 2;
          if (n.d.kind !== 'place') { lx = px - w / 2; ly = py - h / 2; }
          box = [lx, ly, lx + w, ly + h];
          if (lv > 0 && (box[0] < 2 || box[2] > vw() - 2 || box[1] < 2 || box[3] > vh() - 2)) show = false;   // 字露不全就先不显示
          if (show && placed.some(b => !(box[2] < b[0] || box[0] > b[2] || box[3] < b[1] || box[1] > b[3]))) show = false;
          else if (show) { placed.push(box); n.el.style.transform = `translate(${lx}px,${ly}px)`;
            if (n.d.kind === 'place') { n.el.style.setProperty('--dx', (px - lx - 3.5) + 'px'); n.el.style.setProperty('--dy', (py - ly - 3.5) + 'px'); } }
        }
        n.el.style.opacity = show ? (lv === 0 ? Math.max(0, Math.min(.85, (7 - z) / 2)) : 1) : 0;
      }
    }
    function bind() {
      const pts = new Map(); let pinch = null, moved = 0;
      el.addEventListener('wheel', e => { e.preventDefault(); const r = el.getBoundingClientRect(); zoomAt(Math.exp(-e.deltaY * 0.0016), e.clientX - r.left, e.clientY - r.top); }, {passive: false});
      el.addEventListener('pointerdown', e => { if (e.target.closest('.qm-ui')) return; el.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]); el.classList.add('drag'); moved = 0; hint.style.opacity = 0; });
      el.addEventListener('pointermove', e => {
        if (!pts.has(e.pointerId)) return; const p = pts.get(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]);
        if (pts.size === 1) { x += e.clientX - p[0]; y += e.clientY - p[1]; moved += Math.abs(e.clientX - p[0]) + Math.abs(e.clientY - p[1]); draw(); }
        else { const [a, b] = [...pts.values()], r = el.getBoundingClientRect(); const d = Math.hypot(a[0] - b[0], a[1] - b[1]), cx = (a[0] + b[0]) / 2 - r.left, cy = (a[1] + b[1]) / 2 - r.top;
          if (pinch) { x += cx - pinch.cx; y += cy - pinch.cy; zoomAt(d / pinch.d, cx, cy); } pinch = {d, cx, cy}; }
      });
      const up = e => { pts.delete(e.pointerId); if (pts.size < 2) pinch = null; if (!pts.size) el.classList.remove('drag'); };
      el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
      el.addEventListener('dblclick', e => { const r = el.getBoundingClientRect(); zoomAt(2, e.clientX - r.left, e.clientY - r.top); });
      new ResizeObserver(() => { if (!vw() || !vh()) return; if (!fitS) { fit(); } measure(); const z = s / fitS, cx = (vw() / 2 - x) / s, cy = (vh() / 2 - y) / s; fitS = Math.min(vw() / W, vh() / H); s = fitS * z; x = vw() / 2 - cx * s; y = vh() / 2 - cy * s; draw(); }).observe(el);
    }
    Promise.all([fetch(base + 'layout.json').then(r => r.json()), fetch(base + 'labels.json').then(r => r.json()),
                 new Promise(r => world.complete ? r() : (world.onload = r)).then(() => world.decode ? world.decode().catch(() => {}) : 0),
                 document.fonts ? document.fonts.ready : 0]).then(([lay, lab]) => {
      L = lay; LB = lab; W = world.naturalWidth; H = world.naturalHeight;
      Object.assign(world.style, {width: W + 'px', height: H + 'px'});
      if (L.detail_rect) { const r = L.detail_rect; Object.assign(detail.style, {left: r[0] * W + 'px', top: r[1] * H + 'px', width: (r[2] - r[0]) * W + 'px', height: (r[3] - r[1]) * H + 'px'}); }
      const order = {1: 0, 0: 1, 2: 2, 3: 3};
      for (const d of (opt.labels === false ? [] : LB.labels).filter(d => d.from <= N).sort((a, b) => order[a.level] - order[b.level])) {
        const e = document.createElement('div'); e.className = `qm-l ${d.kind} lv${d.level}`; e.textContent = textOf(d.text);
        if (d.kind === 'place') e.insertAdjacentHTML('afterbegin', '');
        layer.appendChild(e); nodes.push({d, el: e});
      }
      measure();
      const st = document.createElement('style'); st.textContent = '.qm-l.place::before{left:var(--dx);top:var(--dy)}'; document.head.appendChild(st);
      fit(); bind();
      if (!opt.start && vh() > vw() * 1.1) {   // 竖屏：初始铺满高度，对准大玉
        const f = (vh() / H) / fitS; zoomAt(f, x + 0.505 * W * s, y + 0.4 * H * s); x += vw() / 2 - (x + 0.505 * W * s); y += vh() / 2 - (y + 0.4 * H * s);
      }
      render();
      // 之后再有字体加载完成（例如中文字体按需下载）、页面从隐藏切回可见，都重新量字、重画
      if (document.fonts) document.fonts.addEventListener('loadingdone', () => { measure(); draw(); });
      document.addEventListener('visibilitychange', () => { if (!document.hidden) { measure(); draw(); } });
      if (opt.start) { const [fx, fy, fz] = opt.start; zoomAt(fz, x + fx * W * s, y + fy * H * s); }
    });
    return {zoomTo: (fz, fx, fy) => { fit(); zoomAt(fz, x + fx * W * s, y + fy * H * s); }};
  }
  window.QuebaMap = {mount};
})();
