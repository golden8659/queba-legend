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

// 第1轮独审：所有视口按同一厘米标尺排人物，脚底对齐并留足完整图像空间。
(()=>{
 const hero=document.querySelector('.hero'),cast=hero?.querySelector('.cast');if(!hero||!cast)return;
 const defs={a:{cm:185,top:312,foot:1781,axis:272.5},c:{cm:165,top:337,foot:1791,axis:385},d:{cm:190,top:273,foot:1786,axis:412.5},b:{cm:180,top:351,foot:1741,axis:422.5}};
 let busy=false,last='';
 function layout(){
  if(busy)return;busy=true;try{
   const paired=innerWidth<=1180,w=cast.clientWidth,h=hero.clientHeight,key=[innerWidth,w,h,paired].join('|');if(last===key)return;
   const ppcm=paired?1.95*w/390:Math.min(2.7,w/300,(h-50)/234),floor=paired?5*w/390:32;
   const faces=paired?{a:110*w/390,c:270*w/390,d:110*w/390,b:280*w/390}:{d:.12*w,a:.36*w,c:.62*w,b:.79*w};
   for(const img of cast.querySelectorAll('img')){const k=Object.keys(defs).find(x=>img.classList.contains(x));if(!k)continue;const d=defs[k],scale=ppcm*d.cm/(d.foot-d.top),ih=1800*scale,iw=900*scale,left=Math.max(0,Math.min(w-iw,faces[k]-d.axis*scale)),bottom=floor-(1800-d.foot)*scale;
    for(const [prop,val] of Object.entries({height:ih+'px',width:iw+'px',left:left+'px',right:'auto',bottom:bottom+'px','max-width':'none','max-height':'none',transform:'none'}))img.style.setProperty(prop,val,'important');
    img.dataset.calibratedCm=String(d.cm);img.dataset.pixelsPerCm=String(ppcm);img.dataset.bodyTop=String(d.top);img.dataset.foot=String(d.foot);
   }
   if(paired){const ch=394*w/390;cast.style.setProperty('height',ch+'px','important');hero.style.setProperty('padding-top',ch+38+'px','important');const dots=hero.querySelector('.mdots');if(dots)dots.style.top=ch+2+'px';}
   else{cast.style.removeProperty('height');hero.style.removeProperty('padding-top');}
   last=[innerWidth,cast.clientWidth,hero.clientHeight,paired].join('|');
  }finally{busy=false;}
 }
 globalThis.qbCalibrateCast=layout;new ResizeObserver(layout).observe(cast);addEventListener('resize',()=>{last='';layout()},{passive:true});layout();
})();

// 大厅卡片随网页主题换图；外文明确使用繁体实机，不冒充外语App。
(()=>{const root=document.documentElement;function sync(){const lang=/^zh(?:-|$)/.test(root.lang)&&root.lang!=='zh-Hant'?'zh':'zh-Hant',skin=root.dataset.skin||'jade';document.querySelectorAll('img[data-game-screenshot]').forEach(img=>{const base=lang==='zh'?'/assets/p126/media/shots/':'/assets/p126/shots/zh-Hant/';img.src=base+img.dataset.gameScreenshot+'-'+skin+'.webp';});}new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['data-skin']});sync();})();

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
  const decorated=e.classList.contains('btn'),flexibleChinese=/^zh(?:-|$)/i.test(root.lang)&&!!e.closest('.p126-aux');
  const setSize=size=>e.style.setProperty('font-size',size+'px',flexibleChinese?'important':'');
  let autoWidth=false;try{autoWidth=decorated&&e.computedStyleMap().get('width').toString()==='auto'}catch{}
  if(autoWidth){setSize(24);const ps=getComputedStyle(e.parentElement),parentWidth=e.parentElement.clientWidth-(parseFloat(ps.paddingLeft)||0)-(parseFloat(ps.paddingRight)||0);const target=Math.ceil(textRange(e).width/.6+2);e.style.minWidth=Math.max(44,Math.min(target,parentWidth))+'px';}
  const insetFor=()=>Math.max(22,Math.min(32,e.clientHeight*.5),innerWidthOf(e)*.20);
  if(/^zh(?:-|$)/i.test(root.lang)&&!flexibleChinese){
   setSize(24);if(e.classList.contains('btn')){const inset=insetFor();const need=Math.ceil(textRange(e).width+2*inset);e.style.minWidth=need+'px';e.dataset.labelInset=String(inset);}e.dataset.fitLanguage='zh';e.dataset.fitSize='24';cache.set(e,key(e));return;
  }
  const cs=getComputedStyle(e),ornament=e.classList.contains('btn')?insetFor():8,left=Math.max(ornament,parseFloat(cs.paddingLeft)||0),right=Math.max(ornament,parseFloat(cs.paddingRight)||0);e.dataset.labelInset=String(ornament);
  const top=Math.max(4,parseFloat(cs.paddingTop)||0),bottom=Math.max(4,parseFloat(cs.paddingBottom)||0);
  // 非固定高度控件以初始/最小高度为基准，防止字号增大反过来撑高自身而反复放大。
  if(!e.dataset.fitBaseHeight)e.dataset.fitBaseHeight=String(Math.min(e.clientHeight,56));
  const boxHeight=e.classList.contains('btn')?e.clientHeight:(parseFloat(cs.minHeight)||Number(e.dataset.fitBaseHeight));
  const height=Math.max(1,boxHeight-top-bottom),cap=Math.max(1,Math.min(24,boxHeight-8));
  const fits=size=>{
   setSize(size);
   const r=textRange(e);
   // clientWidth取整会使自动宽度控件的判断跳变，使用连续的CSS实际宽度。
   return r.width<=innerWidthOf(e)-left-right+.01&&r.height<=height+.01;
  };
  let lo=1,hi=Math.floor(cap*4);
  while(lo<hi){const mid=Math.ceil((lo+hi)/2);if(fits(mid/4))lo=mid;else hi=mid-1;}
  const size=lo/4;setSize(size);
  const nextFits=size+.25<=cap&&fits(size+.25);setSize(size);
  e.dataset.fitLanguage=root.lang;e.dataset.fitSize=String(size);e.dataset.fitCap=String(cap);
  e.dataset.fitNextFits=String(nextFits);e.dataset.fitWidth=String(innerWidthOf(e)-left-right);e.dataset.fitHeight=String(height);
  cache.set(e,key(e));
 }
 function fitTitles(){
  document.querySelectorAll('.plq>span,.entries .ent h3').forEach(e=>{
   if(!visible(e))return;const plaque=e.parentElement.classList.contains('plq'),box=plaque?e.parentElement:e;
   const inset=plaque?Math.max(36,box.clientHeight*.38):2,available=box.clientWidth-2*inset;
   const cap=plaque?(innerWidth<=760?24:30):24;
   e.style.whiteSpace='nowrap';let lo=1,hi=cap*4;
   while(lo<hi){const mid=Math.ceil((lo+hi)/2);e.style.fontSize=mid/4+'px';if(textRange(e).width<=available+.01)lo=mid;else hi=mid-1;}
   e.style.fontSize=lo/4+'px';e.dataset.titleFitWidth=String(available);e.dataset.titleInset=String(inset);
  });
 }
 function all(){
  if(running)return;running=true;
  try{if(root.lang==='en'){const labels={'Read the next chapter ›':'Next chapter','‹ Previous chapter':'Prev. chapter','Latest chapters':'New chapters'};document.querySelectorAll('.paper .btn').forEach(e=>{const old=e.textContent.trim();if(Object.hasOwn(labels,old)){e.setAttribute('aria-label',e.getAttribute('aria-label')||old);e.textContent=labels[old];}});}document.querySelectorAll(selector).forEach(fit);fitTitles();if(root.dataset.buttonFitReady!=='true')root.dataset.buttonFitReady='true';}
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
