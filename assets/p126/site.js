// Keep short mobile labels readable; accessible names and destinations remain explicit.
(()=>{
 const nodes=[...document.querySelectorAll('.qb-unified-head summary,.qb-unified-head .qb-clean-pop>a')];
 const originals=new WeakMap(nodes.map(e=>[e,e.textContent.trim()]));
 function labels(){for(const e of nodes){
  const original=originals.get(e);let text=original;
  if(innerWidth<=600&&e.dataset.qbMobileLabel)text=e.dataset.qbMobileLabel;
  if(innerWidth<=360&&e.dataset.qbNarrowLabel)text=e.dataset.qbNarrowLabel;
  if(innerWidth<=600&&e.closest('#langmenu')){if(e.getAttribute('lang')?.startsWith('zh'))text=e.getAttribute('lang')==='zh-Hant'?'繁體':'简体';}
  if(text!==e.textContent.trim()){e.textContent=text;e.classList.remove('qb-framed');}
  if(text!==original)e.setAttribute('aria-label',original);
 }}
 labels();addEventListener('resize',labels,{passive:true});
 for(const plaque of document.querySelectorAll('.plq')){
  plaque.classList.add('qb-plaque-clean');plaque.closest('.sec')?.classList.add('qb-titled-section');
  const label=plaque.querySelector(':scope>span');if(!label)continue;
  const text=label.textContent.trim();
  if(!/[A-Za-z]/.test(text)&&!/[\s]/.test(text)){label.replaceChildren(...Array.from(text).map(char=>{const i=document.createElement('i');i.textContent=char;return i;}));}
 }
})();

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
   const tablet=matchMedia('(min-width:761px) and (max-width:1366px) and (hover:none) and (pointer:coarse)').matches,wide=tablet&&innerWidth>innerHeight;const paired=innerWidth<=1180||tablet,w=cast.clientWidth,h=hero.clientHeight,key=[innerWidth,innerHeight,w,h,paired,wide].join('|');if(last===key)return;
   const ppcm=paired?1.95*w/390:Math.min(2.7,w/300,(h-50)/234),floor=paired?5*w/390:32;
   const faces=paired?{a:110*w/390,c:270*w/390,d:110*w/390,b:280*w/390}:{d:.12*w,a:.36*w,c:.62*w,b:.79*w};
   for(const img of cast.querySelectorAll('img')){const k=Object.keys(defs).find(x=>img.classList.contains(x));if(!k)continue;const d=defs[k],scale=ppcm*d.cm/(d.foot-d.top),ih=1800*scale,iw=900*scale,left=Math.max(0,Math.min(w-iw,faces[k]-d.axis*scale)),bottom=floor-(1800-d.foot)*scale;
    for(const [prop,val] of Object.entries({height:ih+'px',width:iw+'px',left:left+'px',right:'auto',bottom:bottom+'px','max-width':'none','max-height':'none',transform:'none'}))img.style.setProperty(prop,val,'important');
    img.dataset.calibratedCm=String(d.cm);img.dataset.pixelsPerCm=String(ppcm);img.dataset.bodyTop=String(d.top);img.dataset.foot=String(d.foot);
   }
   if(paired){const ch=394*w/390;cast.style.setProperty('height',ch+'px','important');hero.style.setProperty('padding-top',wide?'0px':ch+38+'px','important');const dots=hero.querySelector('.mdots');if(dots){dots.style.top=(wide?cast.offsetTop:0)+ch+2+'px';dots.style.left=wide?(cast.offsetLeft+w/2)+'px':'50%';}}
   else{cast.style.removeProperty('height');hero.style.removeProperty('padding-top');}
   last=[innerWidth,innerHeight,cast.clientWidth,hero.clientHeight,paired,wide].join('|');
  }finally{busy=false;}
 }
 globalThis.qbCalibrateCast=layout;new ResizeObserver(layout).observe(cast);addEventListener('resize',()=>{last='';layout()},{passive:true});layout();
})();

// 大厅卡片随网页主题换图；外文明确使用繁体实机，不冒充外语App。
(()=>{const root=document.documentElement;function sync(){const lang=/^zh(?:-|$)/.test(root.lang)&&root.lang!=='zh-Hant'?'zh':'zh-Hant',skin=root.dataset.skin||'jade';document.querySelectorAll('img[data-game-screenshot]').forEach(img=>{const base=lang==='zh'?'/assets/p126/media/shots/':'/assets/p126/shots/zh-Hant/';img.src=base+img.dataset.gameScreenshot+'-'+skin+'.webp';});}new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['data-skin']});sync();})();

/* 同组等宽；中文24px并按框宽调字距；外文最高24px，放不下才缩，单行。 */
(()=>{
 const root=document.documentElement,selector='.btn,button,.p126-pop a';
 const vis=e=>e.getClientRects().length&&e.clientWidth>0&&e.clientHeight>0&&getComputedStyle(e).visibility!=='hidden';
 const elements=()=>[...document.querySelectorAll(selector)].filter(e=>!e.classList.contains('menu')&&!e.classList.contains('qp-t')&&!e.closest('.mdots')&&e.tagName!=='INPUT');
 const labels=new WeakMap();let queued=false,running=false;
 const numeric=v=>parseFloat(v)||0;
 const inner=e=>{const s=getComputedStyle(e);return Math.max(1,e.clientWidth-numeric(s.paddingLeft)-numeric(s.paddingRight))};
 function normalize(e){
  if(e.querySelector(':scope>.qb-label'))return;
  let text=e.innerText.replace(/\u3000/g,' ').replace(/\s+/g,' ').trim();if(!text)return;
  const cn=/^zh(?:-|$)/i.test(root.lang);if(cn)text=text.replace(/(?<=\p{Script=Han})\s+(?=\p{Script=Han})/gu,'');
  const label=document.createElement('span');label.className='qb-label';
  const spaced=cn&&/^\p{Script=Han}{2,12}$/u.test(text);
  if(spaced)for(const char of text){const x=document.createElement('span');x.textContent=char;label.append(x)}else label.textContent=text;
  const frame=document.createElement('span');frame.className='qb-frame';frame.setAttribute('aria-hidden','true');
  for(const c of ['tl','tr','bl','br']){const x=document.createElement('i');x.className='qb-c '+c;frame.append(x)}
  for(const c of ['top','bottom','left','right']){const x=document.createElement('i');x.className='qb-e '+c;frame.append(x)}
  e.replaceChildren(label,frame);e.classList.add('qb-framed');labels.set(e,{text,spaced,count:Array.from(text).length});
 }
 function spec(e){
  const drawerNav=!!e.closest('.dnav');const compact=!drawerNav&&!!e.closest('header,.drawer-tools,.p126-pop,.tocbar,.settings');
  const sample=!!e.closest('.settings .seg'),head=!!e.closest('.qb-unified-head'),inset=head?(innerWidth<=600?10:24):sample?24:compact?36:48;
  const height=compact?48:64;const hero=innerWidth>=1181&&!!e.closest('.hero,.nhero');
  const base=sample?80:compact?152:248,max=sample?152:compact?200:hero?248:320;
  e.style.setProperty('--qb-height',height+'px');e.style.setProperty('--qb-inset',inset+'px');
  e.style.setProperty('--qb-font','24px');e.style.setProperty('--qb-gap','0px');e.style.setProperty('--qb-tracking','0px');
  const s=e.querySelector(':scope>.qb-label'),r=s.getBoundingClientRect();
  const label=labels.get(e)||{text:s.textContent,spaced:s.children.length>1,count:Array.from(s.textContent).length};labels.set(e,label);
  const gap=label.spaced?(label.count===2?14:5):0;
  return{e,s,...label,compact,sample,inset,height,base,max,need:r.width+gap*Math.max(0,label.count-1)+inset*2};
 }
 function prepareGroups(specs){
  const map=new Map();
  for(const a of specs){const parent=a.e.parentElement;a.container=parent;
   const p=a.e.closest('.endnext')||
    (parent.classList.contains('p126-card-actions')?'page-card-actions':
    a.e.tagName==='SUMMARY'&&parent.classList.contains('p126-menu')?parent.parentElement:parent);
   if(!map.has(p))map.set(p,[]);map.get(p).push(a)}
  for(const [p,list]of map){
   const node=typeof p!=='string',controls=node?p.querySelectorAll(':scope>input:not([type=hidden]),:scope>textarea'):[];
   if(controls.length)p.classList.add('qb-input-row');
   const equal=list.length>=2&&(!node||(!p.matches('.pl-controls,.pl-audio,.pm,.audio-player')&&!p.closest('[data-audio-page] .player')));
   if(equal&&node&&!p.matches('.nav,.acts,.seg,.p126-pop,.dnav'))p.classList.add('qb-group');
   const maxNeed=Math.max(...list.map(a=>a.need)),target=Math.max(...list.map(a=>a.base));
   let headerBudget=Infinity;
   if(node&&p.matches('.top .acts')){
    const wrap=p.closest('.wrap'),shown=e=>getComputedStyle(e).display!=='none';
    const others=[...wrap.children].filter(e=>e!==p&&shown(e));
    const gap=numeric(getComputedStyle(wrap).columnGap),outer=e=>{const s=getComputedStyle(e);return e.getBoundingClientRect().width+numeric(s.marginLeft)+numeric(s.marginRight)};
    const fixed=[...p.children].filter(e=>shown(e)&&!list.some(a=>e===a.e||e.contains(a.e)));
    const count=[...p.children].filter(shown).length;
    headerBudget=(inner(wrap)-others.reduce((n,e)=>n+outer(e),0)-gap*others.length-fixed.reduce((n,e)=>n+outer(e),0)-numeric(getComputedStyle(p).columnGap)*Math.max(0,count-1))/list.length;
   }
   const commonBound=equal?Math.min(...list.map(a=>Math.min(a.max,inner(node?p:a.container),headerBudget))):Infinity;
   for(const a of list){
    let available=Math.min(inner(node?p:a.container),headerBudget,commonBound);
    if(node&&p.classList.contains('dnav')&&innerWidth>760){const columns=getComputedStyle(p).gridTemplateColumns.split(' ');if(columns.length>1)available=Math.min(available,numeric(columns[0]));}
    const desired=equal?Math.max(target,maxNeed):Math.max(a.base,a.need);
    a.width=Math.max(44,Math.min(a.max,desired,available));a.e.style.setProperty('--qb-width',a.width+'px');
   }
  }
 }
 function fit(a){
  const{e,s,spaced,count,inset}=a;let width=e.getBoundingClientRect().width,available=Math.max(1,width-inset*2);let fs=24,gap=0;
  e.style.setProperty('--qb-font',fs+'px');
  if(spaced){
   const natural=s.getBoundingClientRect().width;
   // 两字也按框宽舒展，但上限约半字，避免过散；长字串留更小的间隔。
   const cap=count===2?14:count===3?9:7;
   gap=Math.max(0,Math.min(cap,(available-natural)/(count-1)*.60));
   e.style.setProperty('--qb-gap',gap.toFixed(2)+'px');
  }else e.style.setProperty('--qb-tracking','0px');
  // 字号从24开始，按0.25px退让；中文优先扩大组宽，窄抽屉用一列保证24px。
  while(s.getBoundingClientRect().width>available+.1&&fs>16){fs-=.25;e.style.setProperty('--qb-font',fs+'px')}
  const cs=getComputedStyle(s),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');ctx.font=[cs.fontWeight,cs.fontSize,cs.fontFamily].join(' ');const metric=ctx.measureText(s.textContent);const ascent=metric.fontBoundingBoxAscent??fs*.8,descent=metric.fontBoundingBoxDescent??fs*.2;const offset=Math.max(-5,Math.min(5,(ascent-descent-metric.actualBoundingBoxAscent+metric.actualBoundingBoxDescent)/2));e.style.setProperty('--qb-optical-y',(-offset).toFixed(2)+'px');e.dataset.qbOpticalY=String(-offset);
  e.dataset.qbFont=String(fs);e.dataset.qbInset=String(inset);e.dataset.qbGap=String(gap);e.dataset.qbOverflow=String(s.getBoundingClientRect().width>available+.2);
 }
 function titles(){
  for(const e of document.querySelectorAll('.plq>span,.entries .ent h3')){
   if(!vis(e))continue;const plaque=e.parentElement.classList.contains('plq'),box=plaque?e.parentElement:e;
   const inset=plaque?(box.classList.contains('qb-plaque-clean')?64:Math.max(36,box.clientHeight*.38)):2,available=box.clientWidth-2*inset,cap=plaque?(innerWidth<=760?24:30):24;
   e.style.whiteSpace='nowrap';let lo=1,hi=cap*4;const r=document.createRange();r.selectNodeContents(e);
   while(lo<hi){const mid=Math.ceil((lo+hi)/2);e.style.fontSize=mid/4+'px';if(r.getBoundingClientRect().width<=available+.01)lo=mid;else hi=mid-1}
   e.style.fontSize=lo/4+'px';e.dataset.titleFitWidth=String(available);e.dataset.titleInset=String(inset);
  }
 }
 function collapseNav(){
  const wrap=document.querySelector('.top>.wrap'),nav=wrap?.querySelector('.nav'),acts=wrap?.querySelector('.acts');if(!wrap||!nav||!acts||innerWidth<1181)return;
  
  if([...nav.querySelectorAll('.qb-framed')].some(e=>e.dataset.qbOverflow==='true')){root.dataset.qbNavCollapsed='true';return;}
  const sum=[...wrap.children].reduce((n,c)=>n+c.getBoundingClientRect().width,0)+Math.max(0,wrap.children.length-1)*16;
  if(sum>inner(wrap)+1)root.dataset.qbNavCollapsed='true';
 }
 function all(){if(running||root.clientWidth<=1||root.clientHeight<=1)return;running=true;observer.disconnect();try{delete root.dataset.qbNavCollapsed;
  const es=elements();es.forEach(normalize);const specs=es.filter(e=>vis(e)&&e.querySelector(':scope>.qb-label')).map(spec);prepareGroups(specs);specs.forEach(fit);titles();collapseNav();root.dataset.buttonFitReady='true';root.dataset.qbFrameVersion='A4x';
 }finally{running=false;observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','hidden','open','lang','data-font']})}}
 function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;all()})}
 const observer=new MutationObserver(schedule);observer.observe(document.body,{subtree:true,childList:true,characterData:true});
 addEventListener('resize',()=>{delete root.dataset.qbNavCollapsed;schedule()},{passive:true});document.fonts.ready.then(schedule);document.fonts.addEventListener('loadingdone',schedule);
 globalThis.qbFitButtons=all;schedule();
})();

// Only a future explicitly published audio element can attach timed captions.
// No private media, auto-play, author notes or review APIs are used here.
globalThis.qbPublicCaptions={attach(audio,segments,stage){
 if(!(audio instanceof HTMLMediaElement)||!stage?.matches('.qb-listening-stage'))throw new TypeError('Published audio and caption panel required');
 const rows=segments.map(x=>({start:Number(x.start),end:Number(x.end),text:String(x.text)}));if(rows.some((x,i)=>!Number.isFinite(x.start)||!Number.isFinite(x.end)||x.start<0||x.end<=x.start||i&&x.start<rows[i-1].start))throw new TypeError('Invalid caption timeline');
 const line=stage.querySelector('[data-caption-current]');let active=-1;
 const tick=()=>{const i=rows.findIndex(x=>audio.currentTime>=x.start&&audio.currentTime<x.end);if(i>=0&&i!==active){active=i;line.textContent=rows[i].text;}};
 const play=()=>{stage.dataset.playing='true';tick();};const pause=()=>{stage.dataset.playing='false';};audio.addEventListener('timeupdate',tick);audio.addEventListener('play',play);audio.addEventListener('pause',pause);audio.addEventListener('ended',pause);tick();
 return()=>{audio.removeEventListener('timeupdate',tick);audio.removeEventListener('play',play);audio.removeEventListener('pause',pause);audio.removeEventListener('ended',pause);delete stage.dataset.playing;};
}};

// Keep the visible paragraph anchored when a touch device changes width during rotation.
(()=>{
 const text=document.querySelector('.p126-reader .rtxt,.castrow,.p126-aux,.p126-legal');if(!text||!matchMedia('(hover:none) and (pointer:coarse)').matches)return;
 const paragraphs=[...text.querySelectorAll(text.matches('.castrow')?'.cc':text.matches('.rtxt')?'p':'h1,h2,h3,p')];let width=innerWidth,anchor=null,pending=null,restoring=false,queued=false,timer;
 function remember(){
  if(restoring||innerWidth!==width)return;
  if(scrollY<8){anchor={top:true};return;}
  const line=Math.min(innerHeight*.3,(document.querySelector('.top')?.getBoundingClientRect().bottom||78)+32);
  const head=document.querySelector('.top')?.getBoundingClientRect().bottom||78;
  const node=paragraphs.find(p=>{const r=p.getBoundingClientRect();return r.top>=head-1&&r.top<innerHeight*.85;})||paragraphs.find(p=>p.getBoundingClientRect().bottom>line);
  if(node)anchor={node,y:node.getBoundingClientRect().top};
 }
 function apply(){if(!pending)return;if(pending.top)scrollTo({top:0,behavior:'instant'});else if(pending.node.isConnected)scrollTo({top:scrollY+pending.node.getBoundingClientRect().top-pending.y,behavior:'instant'});}
 addEventListener('scroll',()=>{if(queued||restoring)return;queued=true;requestAnimationFrame(()=>{queued=false;remember();});},{passive:true});
 addEventListener('resize',()=>{
  if(innerWidth===width&&!restoring)return;
  if(!restoring)pending=anchor;restoring=true;clearTimeout(timer);
  timer=setTimeout(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{apply();timer=setTimeout(()=>{apply();width=innerWidth;pending=null;restoring=false;remember();},160);})),80);
 },{passive:true});
 document.fonts.ready.then(remember);remember();
})();

// Keep Chinese role descriptions readable without changing their text.
(()=>{
 if(!/^zh(?:-|$)/i.test(document.documentElement.lang))return;
 const phrases=/((?:不碰牌的|不碰牌的)|(?:书生|書生)|(?:父亲|父親)|(?:算盘|算盤)|(?:司筹|司籌)|(?:账本|賬本|帳本)|(?:醒狮|醒獅)|(?:班主)|(?:嗓门|嗓門)|(?:狮头|獅頭)|(?:每一局)|(?:牌史)|(?:独独|獨獨)|(?:沉默)|(?:一局))/g;
 for(const p of document.querySelectorAll('.cc p')){
  const text=p.textContent,parts=text.split(phrases);p.replaceChildren(...parts.filter(Boolean).map(x=>{if(!phrases.test(x)){phrases.lastIndex=0;return document.createTextNode(x);}phrases.lastIndex=0;const span=document.createElement('span');span.className='qb-phrase';span.style.whiteSpace='nowrap';span.textContent=x;return span;}));
 }
})();
