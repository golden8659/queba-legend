/* 雀霸一题：每天一道题，按新加坡日期换题；纯静态，结果只存在本机。 */
(function () {
  var root = document.getElementById('qp'); if (!root) return;
  var L = document.documentElement.dataset.lang || 'zh', K = { zh: 'zh', 'zh-Hant': 'zht', en: 'en', ja: 'ja', ko: 'ko' }[L] || 'zh';
  var BASE = root.dataset.base || 'assets/puzzle/', START = '2026-11-03', VIDEO_URL = root.dataset.video || '';
  var SITE = 'https://novel.mahjongx.net/' + ({ zh: '', 'zh-Hant': 'zh-hant/', en: 'en/', ja: 'ja/', ko: 'ko/' }[L] || '') + 'puzzle';
  var I = {
    zh: { h: '雀霸一题', sub: '每天一道麻将题，人人做同一题。答完看解析，晒成绩。', n: '第 {n} 题', novice: '新手', adv: '进阶', ad: '打哪一张？点亮边框的牌可以选。', aw: '你听哪几张？点出所有听的牌，再按确定。', ok: '确定', right: '答对了', wrong: '再接再厉', sec: '用时 {s} 秒', streak: '连对 {d} 天', best: '正确答案', outs: '打出后能和的牌（最多 {t} 张）', waits: '听的牌', share: '分享成绩', copy: '复制成绩', copied: '已复制，去粘贴吧', tomorrow: '明天同一时间换新题（新加坡时间 0 点）', v: '看今日视频', r: '读小说', b: '预约内测', early: '《雀霸一题》{d} 开始，每天一题。先看看规则百科或读读小说吧。', loading: '题目加载中…', fail: '题目没加载出来，请刷新试试。', rev: '题库轮换中，今天重温第 {n} 题。', lab: '雀霸一题', rule: { gd: '广东麻将', hz: '红中麻将（红中是鬼，不能打出）', tdh: '推倒胡（红中当鬼，不能打出）' }, sp: '七对可胡', gh: '鬼', pre: '天元雀霸 App · ', today: '今日', prev: '往期题目在 App 里继续做。', pick: '已选 {n} 张' },
    'zh-Hant': { h: '雀霸一題', sub: '每天一道麻將題，人人做同一題。答完看解析，曬成績。', n: '第 {n} 題', novice: '新手', adv: '進階', ad: '打哪一張？亮框的牌可以選。', aw: '你聽哪幾張？點出所有聽的牌，再按確定。', ok: '確定', right: '答對了', wrong: '再接再厲', sec: '用時 {s} 秒', streak: '連對 {d} 天', best: '正確答案', outs: '打出後能和的牌（最多 {t} 張）', waits: '聽的牌', share: '分享成績', copy: '複製成績', copied: '已複製，去貼上吧', tomorrow: '明天同一時間換新題（新加坡時間 0 點）', v: '看今日影片', r: '讀小說', b: '預約內測', early: '《雀霸一題》{d} 開始，每天一題。先看看規則百科或讀讀小說吧。', loading: '題目載入中…', fail: '題目沒載入出來，請重新整理試試。', rev: '題庫輪換中，今天重溫第 {n} 題。', lab: '雀霸一題', rule: { gd: '廣東麻將', hz: '紅中麻將（紅中是鬼，不能打出）', tdh: '推倒胡（紅中當鬼，不能打出）' }, sp: '七對可胡', gh: '鬼', pre: '天元雀霸 App · ', today: '今日', prev: '往期題目在 App 裡繼續做。', pick: '已選 {n} 張' },
    en: { h: 'Queba Daily Puzzle', sub: 'One mahjong puzzle a day, the same for everyone. Answer, read the why, share your result.', n: 'Puzzle #{n}', novice: 'Beginner', adv: 'Advanced', ad: 'Which tile do you discard? Pick one of the highlighted tiles.', aw: 'Which tiles is this hand waiting on? Tap every winning tile, then confirm.', ok: 'Confirm', right: 'Correct', wrong: 'Not quite', sec: '{s}s', streak: '{d}-day streak', best: 'Best answer', outs: 'Winning tiles after the discard (up to {t})', waits: 'Winning tiles', share: 'Share result', copy: 'Copy result', copied: 'Copied. Paste it anywhere.', tomorrow: 'New puzzle tomorrow (midnight, Singapore time)', v: 'Watch today’s video', r: 'Read the novel', b: 'Join the beta', early: 'Queba Daily Puzzle starts on {d}, one puzzle a day. Meanwhile, read the rules or the novel.', loading: 'Loading the puzzle…', fail: 'The puzzle did not load. Please refresh.', rev: 'The bank is rotating; today is a rerun of puzzle #{n}.', lab: 'Queba Daily Puzzle', rule: { gd: 'Guangdong Mahjong', hz: 'Red Dragon Mahjong (the red dragon is wild and cannot be discarded)', tdh: 'Tuidao Hu (the red dragon is wild and cannot be discarded)' }, sp: 'seven pairs allowed', gh: 'Wild', pre: 'Tianyuan Queba app · ', today: 'Today', prev: 'Past puzzles continue in the app.', pick: '{n} selected' },
    ja: { h: '雀覇クイズ', sub: '毎日ひとつ、みんな同じ麻雀の問題。答えて、解説を読んで、成績をシェア。', n: '第{n}問', novice: '初級', adv: '中級', ad: 'どの牌を切る？ 枠が光っている牌から選んでください。', aw: '何待ち？ 待ち牌をすべてタップして、決定を押してください。', ok: '決定', right: '正解', wrong: '惜しい', sec: '{s}秒', streak: '{d}日連続正解', best: '正解', outs: '切った後に和了できる牌（最大{t}枚）', waits: '待ち牌', share: '成績をシェア', copy: '成績をコピー', copied: 'コピーしました', tomorrow: '明日同じ時間に新しい問題（シンガポール時間0時）', v: '今日の動画を見る', r: '小説を読む', b: 'ベータに申し込む', early: '「雀覇クイズ」は{d}から。毎日ひとつ出題します。ルール解説や小説もどうぞ。', loading: '読み込み中…', fail: '問題を読み込めませんでした。更新してください。', rev: '問題を入れ替え中。今日は第{n}問の復習です。', lab: '雀覇クイズ', rule: { gd: '広東麻雀', hz: '紅中麻雀（紅中は鬼で、切れません）', tdh: '推倒胡（紅中は鬼で、切れません）' }, sp: '七対子可', gh: '鬼', pre: '天元・雀覇アプリ · ', today: '今日', prev: '過去の問題はアプリで続きができます。', pick: '{n}枚選択中' },
    ko: { h: '작패 퀴즈', sub: '하루에 한 문제, 모두가 같은 마작 문제. 풀고, 해설 보고, 성적을 공유하세요.', n: '제 {n}문', novice: '초급', adv: '중급', ad: '어떤 패를 버릴까요? 테두리가 빛나는 패 중에서 고르세요.', aw: '어떤 패를 기다리나요? 기다리는 패를 모두 누른 뒤 확인을 누르세요.', ok: '확인', right: '정답', wrong: '아쉬워요', sec: '{s}초', streak: '{d}일 연속 정답', best: '정답', outs: '버린 뒤 화료할 수 있는 패(최대 {t}장)', waits: '기다리는 패', share: '성적 공유', copy: '성적 복사', copied: '복사했어요', tomorrow: '내일 같은 시각에 새 문제(싱가포르 시간 0시)', v: '오늘 영상 보기', r: '소설 읽기', b: '베타 신청', early: '「작패 퀴즈」는 {d}부터 하루 한 문제. 그 전에 규칙이나 소설을 둘러보세요.', loading: '불러오는 중…', fail: '문제를 불러오지 못했어요. 새로고침해 주세요.', rev: '문제를 교체 중이라 오늘은 제 {n}문 복습입니다.', lab: '작패 퀴즈', rule: { gd: '광동 마작', hz: '홍중 마작(홍중은 만능패이며 버릴 수 없음)', tdh: '퇴도호(홍중은 만능패이며 버릴 수 없음)' }, sp: '치또이쓰 가능', gh: '귀', pre: '천원 작패 앱 · ', today: '오늘', prev: '지난 문제는 앱에서 이어서 풀 수 있어요.', pick: '{n}장 선택' }
  }[L] || null; I = I || {};
  var T = function (k, o) { var s = I[k] == null ? '' : String(I[k]); for (var x in (o || {})) s = s.split('{' + x + '}').join(o[x]); return s; };
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }
  function laDay(ms) { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Singapore' }).format(new Date(ms)); }
  function dayNo(a, b) { return Math.round((Date.UTC(+b.slice(0, 4), +b.slice(5, 7) - 1, +b.slice(8)) - Date.UTC(+a.slice(0, 4), +a.slice(5, 7) - 1, +a.slice(8))) / 864e5); }
  function addDays(d, n) { var t = new Date(Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8)) + n * 864e5); return t.toISOString().slice(0, 10); }
  var FACE = {}; '123456789'.split('').forEach(function (c, i) { FACE[c + 'm'] = i; FACE[c + 's'] = 9 + i; FACE[c + 'p'] = 18 + i; }); '东南西北中发白'.split('').forEach(function (c, i) { FACE[c] = 27 + i; }); FACE['*'] = FACE['中'];
  function tile(code, cls) { var b = document.createElement('button'); b.type = 'button'; b.className = 'qp-t ' + (cls || ''); b.dataset.c = code; b.tabIndex = -1; var im = document.createElement('img'); im.alt = ''; im.src = BASE + 'tiles/f' + (FACE[code] < 10 ? '0' : '') + FACE[code] + '.webp'; im.draggable = false; b.appendChild(im); if (code === '*') { var g = document.createElement('span'); g.className = 'ghost'; g.textContent = T('gh'); b.appendChild(g); } return b; }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function beacon(path) {   // 复用站点统计：用页面路径记「做题人数／答对率／分享点击」，不带任何个人信息
    try { if (document.documentElement.dataset.dev || get('qb-me') === '1' || location.hostname !== 'novel.mahjongx.net') return; var u = get('qb-uid') || ''; if (!/^[a-z0-9]{12,32}$/.test(u)) return; var d = JSON.stringify({ p: path, r: '', v: Math.random().toString(36).slice(2, 12) + Date.now().toString(36), u: u, c: get('qb-ch') || '' }); if (navigator.sendBeacon) navigator.sendBeacon('https://stats.mahjongx.net/h', d); else fetch('https://stats.mahjongx.net/h', { method: 'POST', body: d, keepalive: true, mode: 'no-cors' }); } catch (e) { }
  }
  var q = new URLSearchParams(location.search), preview = q.has('q'), today = laDay(Date.now());
  var st; try { st = JSON.parse(get('qp-state') || '{}'); } catch (e) { st = {}; } st.days = st.days || {};
  function save() { if (!preview) set('qp-state', JSON.stringify(st)); }
  root.textContent = T('loading');
  fetch(BASE + 'bank.json').then(function (r) { return r.json(); }).then(start).catch(function () { root.textContent = T('fail'); });
  function start(bank) {
    var idx = dayNo(START, today), order = bank.order, n = idx + 1, review = false;
    if (preview) { n = Math.max(1, Math.min(order.length, +q.get('q') || 1)); idx = n - 1; }
    else if (idx < 0) { root.innerHTML = ''; root.appendChild(el('h1', '', T('h'))); root.appendChild(el('p', 'qp-sub', T('early', { d: START.slice(5).replace('-', '/') }))); exits(root, false); return; }
    var pos = idx % order.length; if (idx >= order.length) review = true;
    var Q = bank.questions.filter(function (x) { return x.id === order[pos]; })[0]; if (!Q) { root.textContent = T('fail'); return; }
    var key = preview ? 'preview' : today, rec = st.days[key] = st.days[key] || { n: n, t0: Date.now() };
    if (!rec.t0) rec.t0 = Date.now(); save();
    root.innerHTML = '';
    root.appendChild(el('h1', '', T('h')));
    root.appendChild(el('p', 'qp-sub', T('sub')));
    var meta = el('div', 'qp-meta'); meta.appendChild(el('b', '', T('n', { n: n }))); meta.appendChild(el('span', 'qp-chip', Q.level === '新手' ? T('novice') : T('adv'))); meta.appendChild(el('span', '', T('today') + ' ' + today.slice(5).replace('-', '/'))); root.appendChild(meta);
    if (review) root.appendChild(el('p', 'qp-sub', T('rev', { n: pos + 1 })));
    var code = /红中麻将/.test(Q.rule_zh) ? 'hz' : /推倒胡/.test(Q.rule_zh) ? 'tdh' : 'gd';
    root.appendChild(el('div', 'qp-rule', T('pre') + I.rule[code] + (Q.seven_pairs ? ' · ' + T('sp') : '')));
    root.appendChild(el('div', 'qp-ask', T(Q.type === 'discard' ? 'ad' : 'aw')));
    var hand = el('div', 'qp-hand'), area = el('div'), result = el('div'); root.appendChild(hand); root.appendChild(area); root.appendChild(result);
    var optBy = {}; Q.options.forEach(function (o) { if (Q.type === 'discard') optBy[o.discard] = o; });
    if (Q.river && Q.river.length) { var rv = el('div', 'qp-outs'); rv.appendChild(el('span', 'qp-chip', { zh: '牌河', 'zh-Hant': '牌河', en: 'Discards seen', ja: '河', ko: '버린 패' }[L])); Q.river.forEach(function (c) { rv.appendChild(tile(c, 'dim')); }); root.insertBefore(rv, area); }
    var finished = rec.pick != null && !preview;
    function secs() { return Math.max(1, Math.round((Date.now() - rec.t0) / 1000)); }
    function finish(ok, pickLabel) { if (rec.done) return; rec.done = true; rec.ok = ok; rec.sec = rec.sec || secs(); rec.pick = pickLabel; save(); if (!preview) { beacon('/puzzle/answered'); beacon(ok ? '/puzzle/ok' : '/puzzle/wrong'); } show(ok); }
    function show(ok) {
      area.innerHTML = ''; var best = Q.options.filter(function (o) { return o.correct; })[0], hd = el('h2', '', ok ? '✅ ' + T('right') : '❌ ' + T('wrong'));
      result.innerHTML = ''; var box = el('div', 'qp-res ' + (ok ? 'ok' : 'no')); box.appendChild(hd);
      var info = el('p', 'qp-meta'); info.appendChild(el('span', '', T('sec', { s: rec.sec }))); var sk = streak(); if (sk) info.appendChild(el('span', 'qp-chip', T('streak', { d: sk }))); box.appendChild(info);
      if (Q.type === 'discard') { var o = el('div', 'qp-outs'); o.appendChild(el('b', '', T('best') + ' ')); o.appendChild(tile(best.discard, 'right')); box.appendChild(o); var o2 = el('div', 'qp-outs'); o2.appendChild(el('span', '', T('outs', { t: best.outs_total }))); Object.keys(best.outs).forEach(function (c) { var w = tile(c, ''); var s = el('span', 'cnt', '×' + best.outs[c]); w.appendChild(s); o2.appendChild(w); }); box.appendChild(o2); }
      else { var o3 = el('div', 'qp-outs'); o3.appendChild(el('b', '', T('waits') + ' ')); best.waits.forEach(function (c) { o3.appendChild(tile(c, 'right')); }); box.appendChild(o3); }
      var les = (Q.lesson || {})[K] || '', ex = ((Q.explanation || {})[K] || '').replace(les, '').trim(); if (ex) box.appendChild(el('p', '', ex)); box.appendChild(el('p', 'qp-lesson', les));
      var sh = shareText(ok); box.appendChild(el('div', 'qp-share', sh));
      var row = el('div', 'qp-row'), cp = el('button', 'qp-btn', T('copy')); cp.type = 'button'; cp.onclick = function () { copy(sh); beacon('/puzzle/share'); }; row.appendChild(cp); box.appendChild(row);
      exits(box, true); box.appendChild(el('p', 'qp-note', T('tomorrow') + ' · ' + T('prev'))); result.appendChild(box);
      hand.querySelectorAll('.qp-t').forEach(function (t) { t.classList.remove('cand', 'sel'); });
    }
    function streak() { var d = today, c = 0; while (st.days[d] && st.days[d].ok) { c++; d = addDays(d, -1); } return c; }
    function shareText(ok) { var sq = []; for (var i = 6; i >= 0; i--) { var d = addDays(today, -i); if (dayNo(START, d) < 0) continue; var r = st.days[d]; sq.push(r ? (r.ok ? '🟩' : '🟥') : '⬜'); } if (preview) sq = [ok ? '🟩' : '🟥']; return T('lab') + ' ' + T('n', { n: n }) + ' ' + (ok ? '✅' : '❌') + ' ' + T('sec', { s: rec.sec }) + '\n' + sq.join('') + '\n' + SITE + '?c=puzzle_share'; }
    function copy(s) { var done = function () { var t = el('div', 'qp-toast', T('copied')); document.body.appendChild(t); setTimeout(function () { t.remove(); }, 1800); }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(s).then(done, function () { fallback(s, done); }); else fallback(s, done); }
    function fallback(s, done) { var a = document.createElement('textarea'); a.value = s; a.style.position = 'fixed'; a.style.opacity = '0'; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch (e) { } a.remove(); done(); }
    Q.hand.forEach(function (c) { var o = Q.type === 'discard' ? optBy[c] : null, t = tile(c, o ? 'cand' : (Q.type === 'discard' ? 'dim' : '')); if (o) { t.appendChild(el('span', 'lab', o.id)); } hand.appendChild(t); });
    if (Q.type === 'discard') { hand.addEventListener('click', function (e) { var b = e.target.closest('.qp-t.cand'); if (!b || rec.done) return; var o = optBy[b.dataset.c]; hand.querySelectorAll('.qp-t').forEach(function (t) { if (t.dataset.c === o.discard) t.classList.add(o.correct ? 'right' : 'wrong'); }); finish(!!o.correct, o.id); }); }
    else {
      var pick = el('div', 'qp-pick'), sel = {}, cnt = el('p', 'qp-note', T('pick', { n: 0 })), okb = el('button', 'qp-btn', T('ok')); okb.type = 'button'; okb.disabled = true;
      Object.keys(FACE).filter(function (c) { return c !== '*'; }).sort(function (a, b) { return FACE[a] - FACE[b]; }).forEach(function (c) { var t = tile(c, ''); t.onclick = function () { if (rec.done) return; sel[c] = !sel[c]; t.classList.toggle('sel', sel[c]); var k = Object.keys(sel).filter(function (x) { return sel[x]; }).length; cnt.textContent = T('pick', { n: k }); okb.disabled = !k; }; pick.appendChild(t); });
      okb.onclick = function () { var want = Q.options.filter(function (o) { return o.correct; })[0].waits.slice().sort().join(','), got = Object.keys(sel).filter(function (x) { return sel[x]; }).sort().join(','); finish(want === got, got); };
      area.appendChild(pick); area.appendChild(cnt); var r1 = el('div', 'qp-row'); r1.appendChild(okb); area.appendChild(r1);
    }
    if (finished && rec.done) show(rec.ok);
  }
  function exits(parent, after) {
    var g = el('div', 'qp-out'), add = function (txt, href) { var a = el('a', '', txt); a.href = href; g.appendChild(a); };
    if (VIDEO_URL) add('▶ ' + T('v'), VIDEO_URL); add('📖 ' + T('r'), 'https://novel.mahjongx.net/'+(L==='zh'?'':L==='zh-Hant'?'zh-hant/':L+'/')+'chapters/1.html?c=puzzle_read'); add('📲 ' + T('b'), 'https://novel.mahjongx.net/'+(L==='zh'?'':L==='zh-Hant'?'zh-hant/':L+'/')+'subscribe.html?c=puzzle_beta'); parent.appendChild(g);
  }
})();
