/* 拼音乐园：只认读音，读对才能过，不能跳过 */
(function () {
  const P = window.pinyinPro;
  const app = document.getElementById('app');
  const TEST = /[?&]test=1/.test(location.search);
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  // ---------- 存储 ----------
  const KEY = 'pinyin-leyuan-v1';
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.kids) return s; } catch (e) {}
    return { kids: KIDS_DEFAULT.map(k => Object.assign({}, k)), progress: {} };
  }
  let store = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }
  function prog(kid) { return store.progress[kid.id] || (store.progress[kid.id] = { u: 0, l: 0, stars: 0 }); }

  // ---------- 拼音工具 ----------
  const TONE_MAP = { 'ā':'a1','á':'a2','ǎ':'a3','à':'a4','ō':'o1','ó':'o2','ǒ':'o3','ò':'o4','ē':'e1','é':'e2','ě':'e3','è':'e4',
    'ī':'i1','í':'i2','ǐ':'i3','ì':'i4','ū':'u1','ú':'u2','ǔ':'u3','ù':'u4','ǖ':'ü1','ǘ':'ü2','ǚ':'ü3','ǜ':'ü4' };
  function norm(s) { return String(s).toLowerCase().replace(/ü|u:/g, 'v'); }
  function toNum(py) { // 'zhǎo' -> 'zhao3'
    let tone = '', base = '';
    for (const ch of py) { if (TONE_MAP[ch]) { base += TONE_MAP[ch][0] === 'ü' ? 'ü' : TONE_MAP[ch][0]; tone = TONE_MAP[ch][1]; } else base += ch; }
    return norm(base + (tone || '*'));
  }
  function plain(py) { let b = ''; for (const ch of py) b += TONE_MAP[ch] ? TONE_MAP[ch][0] : ch; return b; }
  function numToMark(n) { try { return P.convert(n.replace(/v/g, 'ü'), { format: 'numToSymbol' }); } catch (e) { return n; } }
  const isHan = ch => /[\u3400-\u9fff]/.test(ch);
  function readings(ch) { return P.pinyin(ch, { multiple: true, toneType: 'num', type: 'array' }).map(norm); }
  function same(r, p) { // r 实际读音，p 目标（* 任意声调，0 轻声也任意）
    const rb = r.replace(/\d$/, ''), pb = p.replace(/[\d*]$/, '');
    if (rb !== pb) return false;
    const pt = p.slice(-1);
    if (pt === '*' || pt === '0') return true;
    return r.slice(-1) === pt;
  }
  function targets(item) {
    if (item.word) return P.pinyin(item.show, { toneType: 'num', type: 'array' }).map(norm);
    if (item.ok) return item.ok.map(norm);
    return [toNum(item.show)];
  }
  // 判断听到的文字里有没有目标读音
  function judge(texts, item) {
    const t = targets(item);
    for (const raw of texts) {
      const text = raw.replace(/[\s，。！？、,.!?]/g, '');
      if (!text) continue;
      if (item.word) {
        if (text.includes(item.show)) return true;
        const sets = [...text].filter(isHan).map(readings);
        for (let i = 0; i + t.length <= sets.length; i++) {
          if (t.every((p, j) => sets[i + j].some(r => same(r, p)))) return true;
        }
      } else {
        if (item.kind === '声母' && text.toLowerCase() === item.show) return true;
        for (const ch of text) if (isHan(ch) && readings(ch).some(r => t.some(p => same(r, p)))) return true;
      }
    }
    return false;
  }
  function describeHeard(texts) {
    const t = (texts[0] || '').replace(/[\s，。！？、,.!?]/g, '').slice(0, 8);
    if (!t) return '';
    const py = [...t].filter(isHan).map(ch => P.pinyin(ch)).join(' ');
    return py ? `${t}（${py}）` : t;
  }

  // ---------- 声音 ----------
  let zhVoice = null;
  function pickVoice() {
    const vs = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
    zhVoice = vs.find(v => /zh[-_]CN/i.test(v.lang) && /Ting|婷/i.test(v.name)) || vs.find(v => /zh[-_]CN/i.test(v.lang)) || null;
  }
  if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function speak(text, done) {
    if (!window.speechSynthesis) { done && done(); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN'; u.rate = 0.7; if (zhVoice) u.voice = zhVoice;
    let fired = false; const fin = () => { if (!fired) { fired = true; done && done(); } };
    u.onend = fin; u.onerror = fin; setTimeout(fin, 3500);
    speechSynthesis.speak(u);
  }

  // 每次新建一个识别器，读一次
  let rec = null;
  function listen(onDone) {
    if (TEST) return; // 测试模式用输入框代替
    if (!SR) { onDone({ error: 'unsupported' }); return; }
    try { rec && rec.abort(); } catch (e) {}
    const r = new SR();
    rec = r;
    r.lang = 'zh-CN'; r.interimResults = false; r.continuous = false; r.maxAlternatives = 5;
    let texts = [], ended = false;
    const finish = (extra) => { if (ended) return; ended = true; clearTimeout(timer); try { r.stop(); } catch (e) {} onDone(Object.assign({ texts }, extra)); };
    r.onresult = (e) => {
      for (let i = 0; i < e.results.length; i++) for (let j = 0; j < e.results[i].length; j++) texts.push(e.results[i][j].transcript);
      if (e.results[e.results.length - 1].isFinal) finish();
    };
    r.onerror = (e) => finish({ error: e.error });
    r.onend = () => finish();
    const timer = setTimeout(() => finish(), 6000);
    try { r.start(); } catch (e) { finish({ error: 'start' }); }
  }

  // ---------- 页面 ----------
  const h = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function course(kid) { return COURSES[kid.course]; }
  function totalLessons(kid) { return course(kid).reduce((n, u) => n + u.lessons.length, 0); }
  function doneLessons(kid) { const p = prog(kid); const c = course(kid); let n = 0; for (let i = 0; i < p.u && i < c.length; i++) n += c[i].lessons.length; return n + (p.u < c.length ? p.l : 0); }

  function home() {
    stopAll();
    app.innerHTML = `
      <div class="top"><h1></h1><button class="small-link" id="parent">家长</button></div>
      <div class="hello">拼音乐园</div>
      <p class="hello-sub">谁来读拼音呀？</p>
      ${!SR && !TEST ? `<div class="warn">这个浏览器不能听声音。请用苹果手机自带的 <b>Safari</b> 打开，并在“设置 → Siri → 听写”里打开<b>听写</b>。</div>` : ''}
      ${store.kids.map(k => { const pct = Math.round(doneLessons(k) / totalLessons(k) * 100); return `
        <button class="kid" data-id="${k.id}">
          <div class="ava">${k.avatar}</div>
          <div style="flex:1">
            <div class="name">${h(k.name)}</div>
            <div class="desc">${h(k.desc)} · ⭐ ${prog(k).stars} · 已学 ${pct}%</div>
            <div class="bar"><i style="width:${pct}%"></i></div>
          </div>
        </button>`; }).join('')}
    `;
    app.querySelectorAll('.kid').forEach(b => b.onclick = () => map(store.kids.find(k => k.id === b.dataset.id)));
    app.querySelector('#parent').onclick = parentGate;
  }

  function map(kid) {
    stopAll();
    const p = prog(kid), c = course(kid);
    const allDone = p.u >= c.length;
    app.innerHTML = `
      <div class="top"><button class="icon-btn" id="back">‹</button><h1>${kid.avatar} ${h(kid.name)}的拼音</h1></div>
      ${allDone ? `<div class="panel" style="text-align:center"><div style="font-size:60px">🏆</div><b>全部学完啦！</b><div class="note">可以在家长页面重新开始</div></div>` : ''}
      ${c.map((u, ui) => `
        <div class="unit">
          <div class="unit-title"><span class="dot" style="background:${u.color}"></span>${h(u.title)}</div>
          <div class="lessons">
            ${u.lessons.map((ls, li) => {
              const done = ui < p.u || (ui === p.u && li < p.l);
              const now = ui === p.u && li === p.l;
              return `<button class="lesson ${done ? 'done' : ''} ${now ? 'now' : ''}" data-u="${ui}" data-l="${li}" style="${done || now ? 'background:' + u.color : ''}">${done ? '✓' : now ? '▶' : '🔒'}</button>`;
            }).join('')}
          </div>
          <div class="unit-sample">${u.lessons.flat().slice(0, 12).map(i => h(i.show)).join('  ')}${u.lessons.flat().length > 12 ? ' …' : ''}</div>
        </div>`).join('')}
    `;
    app.querySelector('#back').onclick = home;
    app.querySelectorAll('.lesson').forEach(b => b.onclick = () => {
      const ui = +b.dataset.u, li = +b.dataset.l;
      const unlocked = ui < p.u || (ui === p.u && li <= p.l);
      if (!unlocked) { b.animate([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'none' }], 240); return; }
      lesson(kid, ui, li);
    });
    const cur = app.querySelector('.lesson.now');
    if (cur) setTimeout(() => cur.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50);
  }

  let session = null;
  function stopAll() { try { rec && rec.abort(); } catch (e) {} if (window.speechSynthesis) speechSynthesis.cancel(); session = null; }

  function lesson(kid, ui, li) {
    stopAll();
    const u = course(kid)[ui];
    session = { kid, ui, li, unit: u, items: u.lessons[li], idx: 0, tries: 0, busy: false };
    item();
  }

  function decompose(it) {
    const base = plain(it.show);
    let ini = INITIALS.find(x => base.startsWith(x)) || '';
    let rest = it.show.slice(ini.length);
    if (it.kind === '三拼音节') {
      return `<b class="sm">${ini}</b> – <b class="jm">${rest[0]}</b> – <b class="ym">${rest.slice(1)}</b> → <b>${it.show}</b>`;
    }
    return `<b class="sm">${ini}</b> – <b class="ym">${rest}</b> → <b>${it.show}</b>`;
  }

  function item() {
    const s = session; if (!s) return;
    const it = s.items[s.idx];
    const color = s.unit.color;
    let main;
    if (it.word) {
      const py = P.pinyin(it.show);
      main = `<div class="py-small">${h(py)}</div><div class="big han">${h(it.show)}</div>`;
    } else {
      main = `<div class="big ${it.show.length >= 4 ? 'long' : ''}">${h(it.show)}</div>`;
      if (it.syllable) main += `<div class="split">${decompose(it)}</div>`;
    }
    app.innerHTML = `
      <div class="top"><button class="icon-btn" id="back">‹</button>
        <div class="steps">${s.items.map((_, i) => `<i class="${i < s.idx ? 'on' : i === s.idx ? 'cur' : ''}"></i>`).join('')}</div></div>
      <div class="stage">
        <div><span class="kind" style="background:${color}">${h(it.kind)}</span>${it.tag ? `<span class="tag">${h(it.tag)}</span>` : ''}</div>
        <div class="card">
          <button class="listen" id="listen" aria-label="听一听">🔊</button>
          ${main}
          ${it.emoji ? `<div class="emoji">${it.emoji}${it.syllable ? ' ' + h(it.say) : ''}</div>` : ''}
          ${it.hint && !it.syllable ? `<div class="hint">${h(it.hint)}</div>` : ''}
        </div>
        <button class="mic" id="mic">🎤</button>
        <div class="mic-label" id="micLabel">点一下，大声读</div>
        <div class="feedback" id="fb"></div>
        ${TEST ? `<div class="testbox"><input id="fake" placeholder="测试：输入听到的字"><button class="pill" id="fakeGo">识别</button></div>` : ''}
      </div>`;
    app.querySelector('#back').onclick = () => map(s.kid);
    app.querySelector('#listen').onclick = () => speak(it.say);
    app.querySelector('#mic').onclick = () => start();
    if (TEST) app.querySelector('#fakeGo').onclick = () => result({ texts: [app.querySelector('#fake').value] });
    if (s.kid.autoPlay && s.tries === 0) setTimeout(() => session === s && speak(it.say), 300);
  }

  function start() {
    const s = session; if (!s || s.busy) return;
    s.busy = true;
    if (window.speechSynthesis) speechSynthesis.cancel();
    const mic = app.querySelector('#mic'), label = app.querySelector('#micLabel'), fb = app.querySelector('#fb');
    mic.classList.add('rec'); label.textContent = '正在听…'; fb.className = 'feedback'; fb.innerHTML = '';
    listen(result);
  }

  function result(res) {
    const s = session; if (!s) return;
    s.busy = false;
    const it = s.items[s.idx];
    const mic = app.querySelector('#mic'), label = app.querySelector('#micLabel'), fb = app.querySelector('#fb');
    if (mic) mic.classList.remove('rec');
    if (label) label.textContent = '点一下，大声读';
    const texts = (res.texts || []).filter(t => t && t.trim());
    if (res.error === 'unsupported') { fb.className = 'feedback bad'; fb.innerHTML = '这个浏览器不能听声音，请用 Safari 打开'; return; }
    if (res.error === 'not-allowed' || res.error === 'service-not-allowed') {
      fb.className = 'feedback bad'; fb.innerHTML = '没有麦克风权限<span class="heard">请在弹窗里点“允许”，或打开 设置 → Siri → 听写</span>'; return;
    }
    if (!texts.length) {
      s.tries++;
      fb.className = 'feedback bad'; fb.innerHTML = '没听到声音，大声一点再读一次 📢';
      return;
    }
    if (judge(texts, it)) {
      fb.className = 'feedback ok'; fb.innerHTML = ['读对啦！🎉', '真棒！👍', '太厉害了！🌟', '完全正确！✨'][Math.floor(Math.random() * 4)];
      confetti();
      speak('真棒');
      setTimeout(() => {
        if (session !== s) return;
        s.idx++; s.tries = 0;
        if (s.idx >= s.items.length) finishLesson(); else item();
      }, 1300);
    } else {
      s.tries++;
      fb.className = 'feedback bad';
      fb.innerHTML = `不太对，再读一次${s.tries >= 2 ? '，先听听怎么读 👂' : ''}<span class="heard">听起来像：${h(describeHeard(texts))}</span>`;
      if (s.tries >= 2) setTimeout(() => session === s && speak(it.say), 600);
    }
  }

  function finishLesson() {
    const s = session; const kid = s.kid; const p = prog(kid); const c = course(kid);
    const isNew = s.ui === p.u && s.li === p.l;
    if (isNew) {
      p.stars++;
      p.l++;
      if (p.l >= c[p.u].lessons.length) { p.u++; p.l = 0; }
      save();
    }
    stopAll();
    app.innerHTML = `
      <div class="done-wrap">
        <div class="star">⭐</div>
        <h2>这一课过关啦！</h2>
        <div class="note">${isNew ? `${h(kid.name)}一共得了 ${p.stars} 颗星` : '复习完成'}</div>
        ${p.u < c.length ? `<button class="btn" id="next">下一课</button>` : `<div style="font-size:60px;margin-top:16px">🏆</div><b>全部学完啦！</b>`}
        <button class="btn ghost" id="mapBtn">回到地图</button>
      </div>`;
    speak('过关啦，真棒');
    const nx = app.querySelector('#next'); if (nx) nx.onclick = () => lesson(kid, p.u, p.l);
    app.querySelector('#mapBtn').onclick = () => map(kid);
  }

  function confetti() {
    const em = ['🎉', '⭐', '🌟', '✨', '🎈'];
    for (let i = 0; i < 14; i++) {
      const d = document.createElement('div');
      d.className = 'confetti'; d.textContent = em[i % em.length];
      d.style.left = Math.random() * 100 + 'vw'; d.style.animationDelay = Math.random() * .4 + 's';
      document.body.appendChild(d); setTimeout(() => d.remove(), 2200);
    }
  }

  // ---------- 家长 ----------
  function parentGate() {
    const a = 6 + Math.floor(Math.random() * 4), b = 6 + Math.floor(Math.random() * 4);
    app.innerHTML = `
      <div class="top"><button class="icon-btn" id="back">‹</button><h1>家长</h1></div>
      <div class="gate"><div class="note">请家长回答</div><div class="q">${a} × ${b} = ?</div>
      <input id="ans" inputmode="numeric"><div><button class="btn" id="ok">进入</button></div></div>`;
    app.querySelector('#back').onclick = home;
    app.querySelector('#ok').onclick = () => { if (+app.querySelector('#ans').value === a * b) parent(); else app.querySelector('#ans').value = ''; };
  }
  function parent() {
    app.innerHTML = `
      <div class="top"><button class="icon-btn" id="back">‹</button><h1>家长设置</h1></div>
      <div class="panel"><h3>孩子</h3>
        ${store.kids.map(k => `
          <div class="row"><span style="font-size:28px">${k.avatar}</span>
            <div class="grow"><input type="text" data-name="${k.id}" value="${h(k.name)}"></div>
            <button class="pill" data-auto="${k.id}">${k.autoPlay ? '先示范：开' : '先示范：关'}</button>
            <button class="pill red" data-reset="${k.id}">重学</button></div>`).join('')}
        <div class="note" style="margin-top:8px">“先示范”开着时，每个拼音会先读一遍给孩子听。</div>
      </div>
      <div class="panel"><h3>课程内容</h3>
        ${store.kids.map(k => `<div class="row"><div class="grow"><b>${h(k.name)}</b><div class="note">${course(k).map(u => u.title).join(' → ')}</div></div></div>`).join('')}
      </div>
      <div class="panel"><h3>使用说明</h3><div class="note">
        1. 用 Safari 打开，点分享按钮 →“添加到主屏幕”。<br>
        2. 第一次读会弹出麦克风和语音识别权限，都点“允许”。<br>
        3. 需要在 设置 → Siri → 听写 里打开“听写”。<br>
        4. 每个拼音必须读对才能下一个，没有跳过按钮。</div></div>`;
    app.querySelector('#back').onclick = home;
    app.querySelectorAll('[data-name]').forEach(inp => inp.onchange = () => { const k = store.kids.find(x => x.id === inp.dataset.name); k.name = inp.value.trim() || k.name; save(); });
    app.querySelectorAll('[data-auto]').forEach(b => b.onclick = () => { const k = store.kids.find(x => x.id === b.dataset.auto); k.autoPlay = !k.autoPlay; save(); parent(); });
    app.querySelectorAll('[data-reset]').forEach(b => b.onclick = () => {
      const k = store.kids.find(x => x.id === b.dataset.reset);
      if (confirm(`确定让${k.name}从头开始学吗？星星会清零。`)) { store.progress[k.id] = { u: 0, l: 0, stars: 0 }; save(); parent(); }
    });
  }

  // 供测试使用
  window.__pinyinJudge = (text, item) => judge([text], item);
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  home();
})();
