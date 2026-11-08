import {initAudioPlayer} from './player.mjs';
const root=document.querySelector('[data-audio-page]');
if(root){
 const lang=root.dataset.audioLanguage||'zh',pre={zh:'','zh-Hant':'zh-hant/',en:'en/',ja:'ja/',ko:'ko/'}[lang]||'';
 const local=location.hostname==='127.0.0.1'||location.hostname==='localhost';
 const catalogue=local?'/assets/audio/catalog.json':root.dataset.catalog;
 async function json(url){const r=await fetch(url,{cache:'no-cache'});if(!r.ok){const e=Error('catalogue');e.status=r.status;throw e}return r.json()}
 Promise.all([json('/assets/audio/ui.json'),json(catalogue).catch(e=>catalogue!=='/assets/audio/catalog.json'&&![401,403].includes(e.status)?json('/assets/audio/catalog.json'):Promise.reject(e))]).then(([ui,cat])=>{
  const W=ui.words[lang]||ui.words.zh;
  const chapterLabel=n=>lang==='en'?'Chapter '+n:lang==='ko'?'제'+n+'장':lang==='ja'?'第'+n+'章':'第 '+n+' 章';
  const chapterTitle=x=>x.titles[lang]||'';
  const pendingTitle={zh:'章节标题待公布','zh-Hant':'章節標題待公布',en:'Title to be announced',ja:'章題は後日公開',ko:'제목 공개 예정'}[lang];
  if(cat.schema!=='P126_AUDIO_1'||!Array.isArray(cat.chapters))throw Error('catalogue format');
  let chapter=Number(new URLSearchParams(location.search).get('chapter')||1);if(!Number.isInteger(chapter)||chapter<1||chapter>40)chapter=1;
  const selected=cat.chapters.find(x=>x.chapter===chapter);if(!selected)throw Error('chapter');
  const available=x=>x.status==='published'&&typeof x.audio_url==='string'&&/^https:\/\//.test(x.audio_url)&&typeof x.revision==='string'&&!!x.revision;
  const slot=root.querySelector('[data-player-slot]');slot.innerHTML=ui.player;
  const P=slot.querySelector('.player');P.dataset.ch=String(chapter);P.dataset.track='zh';P.dataset.revision=selected.revision||'pending';
  P.querySelector('.pl-head b').textContent=chapterLabel(chapter)+(chapterTitle(selected)?' · '+chapterTitle(selected):'');
  P.querySelector('.tag').textContent=available(selected)?W.live:W.soon;
  P.querySelector('.pl-play').textContent=W.play;P.querySelector('.pl-play').setAttribute('aria-label',W.play);
  P.querySelector('.pl-rate').setAttribute('aria-label',lang.startsWith('zh')?'播放倍速':'Playback speed');
  const A=P.querySelector('audio');A.setAttribute('preload','none');A.removeAttribute('src');A.dataset.src=available(selected)?selected.audio_url:'';
  P.classList.toggle('pending',!available(selected));
  for(const e of P.querySelectorAll('button,input')){e.disabled=!available(selected);e.setAttribute('aria-disabled',String(!available(selected)))}
  for(const e of P.querySelectorAll('.pl-play,.pl-rate')){e.setAttribute('aria-disabled',String(!available(selected)));e.classList.toggle('off',!available(selected))}
  const miniSlot=root.querySelector('[data-mini-slot]');miniSlot.innerHTML=ui.mini;
  const M=miniSlot.querySelector('.pl-mini');M.querySelector('.pm-info span').textContent=chapterLabel(chapter);M.querySelector('.pm-play').textContent=W.play;
  initAudioPlayer(P,M,W);
  const list=root.querySelector('[data-audio-list]');
  cat.chapters.forEach(x=>{
   const li=document.createElement('li'),a=document.createElement('a');a.className='audio-chapter';const u=new URL(location.href);u.searchParams.set('chapter',String(x.chapter));a.href=u.pathname+u.search;
   if(x.chapter===chapter){a.setAttribute('aria-current','true');a.classList.add('on')}
   const b=document.createElement('b');b.textContent=chapterLabel(x.chapter);a.append(b);
   const titles=document.createElement('span');titles.className='audio-titles';const title=document.createElement('strong');title.textContent=chapterTitle(x)||pendingTitle;titles.append(title);
   // 当前语言页面仅展示当前语种标题，避免简繁串字和同名副标题重复。
   a.append(titles);
   const state=document.createElement('em');state.textContent=available(x)?W.live:W.soon;a.append(state);li.append(a);list.append(li);
  });
  root.querySelector('[data-audio-loading]').hidden=true;
 }).catch(()=>{root.querySelector('[data-audio-loading]').textContent={zh:'目录暂时无法加载，请稍后刷新。','zh-Hant':'目錄暫時無法載入，請稍後重新整理。',en:'The chapter list could not load. Please refresh.',ja:'目次を読み込めませんでした。更新してください。',ko:'목차를 불러올 수 없습니다. 새로고침해 주세요.'}[lang]||'Coming soon';});
}
