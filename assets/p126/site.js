(()=>{
 const root=document.documentElement,menus=[...document.querySelectorAll('details.p126-menu')];
 const save=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
 function mark(){document.querySelectorAll('[data-skin-set]').forEach(x=>{const on=x.dataset.skinSet===root.dataset.skin;x.classList.toggle('on',on);x.setAttribute('aria-pressed',String(on))})}
 mark();
 document.querySelectorAll('[data-skin-set]').forEach(x=>x.addEventListener('click',()=>{root.dataset.skin=x.dataset.skinSet;save('qb-skin',x.dataset.skinSet);mark();menus.forEach(m=>m.open=false)}));
 menus.forEach(m=>m.addEventListener('toggle',()=>{if(m.open)menus.forEach(n=>{if(n!==m)n.open=false})}));
 document.addEventListener('click',e=>menus.forEach(m=>{if(m.open&&!m.contains(e.target))m.open=false}));
 const toggle=document.querySelector('[data-menu-toggle]'),drawer=document.querySelector('.drawer');
 if(toggle&&drawer)toggle.addEventListener('click',()=>{drawer.hidden=!drawer.hidden;toggle.setAttribute('aria-expanded',String(!drawer.hidden))});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){menus.forEach(m=>m.open=false);if(drawer)drawer.hidden=true;if(toggle)toggle.setAttribute('aria-expanded','false')}});
 document.querySelectorAll('[id^="langmenu"] a').forEach(a=>a.addEventListener('click',()=>{const l=a.getAttribute('lang');if(l)save('qb-lang',l==='zh-Hans'?'zh':l);if(l==='zh-Hant')save('qb-zh','t');if(l==='zh-Hans'||l==='zh')save('qb-zh','s')}));
 // Preserve the selected theme across our two independently hosted origins.
 document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a)return;try{const u=new URL(a.href);if(['mahjongx.net','novel.mahjongx.net','preview.mahjongx.net'].includes(u.hostname)){u.searchParams.set('skin',root.dataset.skin);a.href=u.href}}catch{}});
 const cast=document.querySelector('.hero .cast'),dots=[...document.querySelectorAll('.mdots button')];
 function markCast(){if(!cast)return;const idx=Math.round(cast.scrollLeft/cast.clientWidth);dots.forEach((b,i)=>{b.classList.toggle('on',i===idx);b.setAttribute('aria-selected',String(i===idx));b.tabIndex=i===idx?0:-1})}
 if(cast&&dots.length){cast.addEventListener('scroll',markCast,{passive:true});dots.forEach((b,i)=>{b.addEventListener('click',()=>cast.scrollTo({left:i*cast.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const n=(i+(e.key==='ArrowRight'?1:-1)+dots.length)%dots.length;dots[n].click();dots[n].focus()})});markCast()}
 document.querySelectorAll('[data-toc-order]').forEach(b=>b.addEventListener('click',()=>{const list=document.querySelector('[data-toc-list]');if(!list)return;const rows=[...list.children];if(list.dataset.order!==b.dataset.tocOrder){rows.reverse().forEach(x=>list.appendChild(x));list.dataset.order=b.dataset.tocOrder}document.querySelectorAll('[data-toc-order]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))}));
 document.querySelectorAll('[data-toc-list]').forEach(x=>x.dataset.order='asc');
 // The inherited end-of-chapter client may create its primary link after parsing.
 document.querySelectorAll('.endnext-big').forEach(a=>{a.classList.add('btn','main');a.style.setProperty('--ls','0px');a.style.setProperty('--lsm','0px')});
 const quiz=document.querySelector('#qp');
 if(quiz){const skinQuiz=()=>quiz.querySelectorAll('.qp-btn').forEach(b=>{b.classList.add('btn','main');b.style.setProperty('--w','auto');b.style.setProperty('--mw','auto');b.style.setProperty('--ls','0px');b.style.setProperty('--lsm','0px')});skinQuiz();new MutationObserver(skinQuiz).observe(quiz,{childList:true,subtree:true})}
 // Audio remains explicitly pending; no audio URL is guessed or fetched.
})();

/* 作者返修2：中文统一24px；其他语言以24px为上限，只有放不下才缩小并保持单行。 */
(()=>{
 const root=document.documentElement,selector='.btn,button,summary,.p126-pop a,.p126-legal nav a';
 let queued=false,running=false,fontEpoch=0;const cache=new WeakMap();
 const visible=e=>e.getClientRects().length&&e.clientWidth>0&&e.clientHeight>0&&getComputedStyle(e).visibility!=='hidden';
 function textRange(e){const range=document.createRange();range.selectNodeContents(e);return range.getBoundingClientRect();}
 function key(e){const s=getComputedStyle(e);return [root.lang,e.innerText,e.clientWidth,e.clientHeight,innerWidth,fontEpoch,s.fontFamily,s.fontWeight,s.fontSize,s.padding,s.minHeight,s.width].join('|');}
 function innerWidthOf(e){const s=getComputedStyle(e),w=parseFloat(s.width);return Number.isFinite(w)?(s.boxSizing==='border-box'?w-(parseFloat(s.borderLeftWidth)||0)-(parseFloat(s.borderRightWidth)||0):w+(parseFloat(s.paddingLeft)||0)+(parseFloat(s.paddingRight)||0)):e.clientWidth;}
 // 题库牌面是图片选择控件，图片面积不参与文字字号拟合，牌面与选项标识保持原样。
 function fit(e){
  if(!visible(e)||e.classList.contains('menu')||e.classList.contains('qp-t')||!e.innerText.trim())return;
  if(cache.get(e)===key(e))return;
  if(/^zh(?:-|$)/i.test(root.lang)){
   e.style.fontSize='24px';e.dataset.fitLanguage='zh';e.dataset.fitSize='24';cache.set(e,key(e));return;
  }
  const cs=getComputedStyle(e),left=Math.max(8,parseFloat(cs.paddingLeft)||0),right=Math.max(8,parseFloat(cs.paddingRight)||0);
  const top=Math.max(4,parseFloat(cs.paddingTop)||0),bottom=Math.max(4,parseFloat(cs.paddingBottom)||0);
  // 非固定高度控件以初始/最小高度为基准，防止字号增大反过来撑高自身而反复放大。
  if(!e.dataset.fitBaseHeight)e.dataset.fitBaseHeight=String(Math.min(e.clientHeight,56));
  const boxHeight=e.classList.contains('btn')?e.clientHeight:(parseFloat(cs.minHeight)||Number(e.dataset.fitBaseHeight));
  const height=Math.max(1,boxHeight-top-bottom),cap=Math.max(1,Math.min(24,boxHeight-8));
  const fits=size=>{
   e.style.fontSize=size+'px';
   const r=textRange(e);
   // clientWidth取整会使自动宽度控件的判断跳变，使用连续的CSS实际宽度。
   return r.width<=innerWidthOf(e)-left-right+.01&&r.height<=height+.01;
  };
  let lo=1,hi=Math.floor(cap*4);
  while(lo<hi){const mid=Math.ceil((lo+hi)/2);if(fits(mid/4))lo=mid;else hi=mid-1;}
  const size=lo/4;e.style.fontSize=size+'px';
  const nextFits=size+.25<=cap&&fits(size+.25);e.style.fontSize=size+'px';
  e.dataset.fitLanguage=root.lang;e.dataset.fitSize=String(size);e.dataset.fitCap=String(cap);
  e.dataset.fitNextFits=String(nextFits);e.dataset.fitWidth=String(innerWidthOf(e)-left-right);e.dataset.fitHeight=String(height);
  cache.set(e,key(e));
 }
 function all(){
  if(running)return;running=true;
  try{document.querySelectorAll(selector).forEach(fit);if(root.dataset.buttonFitReady!=='true')root.dataset.buttonFitReady='true';}
  finally{running=false;}
 }
 function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;all();observe();});}
 const watched=new WeakSet(),resize=new ResizeObserver(schedule);
 function observe(){document.querySelectorAll(selector).forEach(e=>{if(!watched.has(e)){watched.add(e);resize.observe(e);}});}
 new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','hidden','open','lang','data-font']});
 addEventListener('resize',schedule,{passive:true});document.fonts.ready.then(()=>{fontEpoch++;schedule();});
 document.fonts.addEventListener('loadingdone',()=>{fontEpoch++;schedule();});
 // 显式同步入口供同一页面打开抽屉后测量，生产交互也由观察器同步。
 globalThis.qbFitButtons=all;observe();schedule();
})();
