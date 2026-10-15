(function(){
  var root=document.documentElement;
  function get(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function set(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  function mark(sel,attr,val){document.querySelectorAll(sel).forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute(attr)===val))})}
  // text size
  var size=get('qb-size')||'20';
  function applySize(v){size=v;root.style.setProperty('--size',v+'px');set('qb-size',v);mark('[data-size]','data-size',v)}
  document.querySelectorAll('[data-size]').forEach(function(b){b.onclick=function(){applySize(b.dataset.size)}});
  if(!document.querySelector('[data-size="'+size+'"]')){var opts=[].map.call(document.querySelectorAll('[data-size]'),function(b){return b.dataset.size});size=opts.reduce(function(a,b){return Math.abs(b-size)<Math.abs(a-size)?b:a},opts[2]||'20');root.style.setProperty('--size',size+'px')}
  mark('[data-size]','data-size',size);
  // typeface
  var font=get('qb-font');if(!document.querySelector('[data-font="'+font+'"]'))font='serif';
  function applyFont(v){font=v;if(window.qbFont)qbFont(v);root.dataset.font=v;set('qb-font',v);mark('[data-font]','data-font',v)}
  document.querySelectorAll('[data-font]').forEach(function(b){b.onclick=function(){applyFont(b.dataset.font)}});
  root.dataset.font=font;mark('[data-font]','data-font',font);
  // night mode
  function isDark(){return root.dataset.theme?root.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches}
  function markTheme(){mark('[data-theme-set]','data-theme-set',isDark()?'dark':'light')}
  document.querySelectorAll('[data-theme-set]').forEach(function(b){b.onclick=function(){root.dataset.theme=b.dataset.themeSet;set('qb-theme',root.dataset.theme);markTheme()}});
  markTheme();
  // close menus when tapping elsewhere; only one open at a time
  var menus=document.querySelectorAll('details.menu');
  menus.forEach(function(m){m.addEventListener('toggle',function(){if(m.open)menus.forEach(function(o){if(o!==m)o.open=false})})});
  document.addEventListener('click',function(e){menus.forEach(function(m){if(m.open&&!m.contains(e.target))m.open=false})});
  // Simplified / Traditional Chinese. On zh pages the text is converted in place with OpenCC;
  // from other languages the link opens the zh page and the stored choice applies there.
  // ?zh=t / ?zh=s in a link picks Traditional / Simplified for this reader (used by Taiwan / Hong Kong posts)
  try{var zq=new URLSearchParams(location.search).get('zh');if(zq==='t'||zq==='s')set('qb-zh',zq)}catch(e){}
  var orig=null,trad=get('qb-zh')==='t',onZh=root.dataset.lang==='zh';
  function walk(fn){var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),n,i=0;while(n=w.nextNode()){if(n.parentNode.closest('.pop'))continue;fn(n,i++)}}
  function markZh(){document.querySelectorAll('[data-zh]').forEach(function(a){if(onZh&&(a.dataset.zh==='t')===trad)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')})}
  function applyTrad(on){
    if(!window.OpenCC){if(window.qbCC&&on)qbCC(function(){applyTrad(trad)});return}
    if(!orig){orig=[];walk(function(n){orig.push(n.nodeValue)})}
    var conv=window.OpenCC.Converter({from:'cn',to:'tw'});
    walk(function(n,i){n.nodeValue=on?conv(orig[i]):orig[i]});
    root.lang=on?'zh-Hant':'zh-Hans';
  }
  document.querySelectorAll('[data-zh]').forEach(function(a){a.onclick=function(e){
    trad=a.dataset.zh==='t';set('qb-zh',trad?'t':'s');
    if(onZh){e.preventDefault();applyTrad(trad);markZh();var m=document.getElementById('langmenu');if(m)m.open=false}
  }});
  if(onZh){markZh();window.addEventListener('load',function(){if(trad)applyTrad(true)})}
  // guestbook (stats.mahjongx.net/m): submit for moderation, list approved messages
  var gf=document.getElementById('gbform');
  if(gf){
    var S=JSON.parse(gf.dataset.strings),API='https://stats.mahjongx.net/m',lang=gf.dataset.lang,out=document.getElementById('gbmsg'),list=document.getElementById('gblist');
    var loc={zh:'zh-CN',en:'en-US',ja:'ja-JP',ko:'ko-KR'}[lang];
    function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
    function load(){fetch(API+'?lang='+lang).then(function(r){return r.json()}).then(function(d){
      list.textContent='';
      if(!d.messages||!d.messages.length){list.appendChild(el('p','empty',S.gb_empty));return}
      d.messages.forEach(function(m){var it=el('div','gbitem'),who=el('div','who');who.appendChild(el('b',null,m.name||S.gb_anon));who.appendChild(document.createTextNode(new Date(m.ts).toLocaleDateString(loc)));it.appendChild(who);it.appendChild(el('p','txt',m.body));
        if(m.reply){var r=el('div','rep');r.appendChild(el('b',null,S.gb_reply));r.appendChild(document.createTextNode(m.reply));it.appendChild(r)}list.appendChild(it)});
    }).catch(function(){})}
    load();
    gf.onsubmit=function(e){e.preventDefault();var b=gf.querySelector('button');b.disabled=true;out.textContent='';
      fetch(API,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({name:gf.elements["name"].value,body:gf.elements["body"].value,hp:gf.elements["hp"].value,lang:lang})})
      .then(function(r){return r.json()}).then(function(d){if(d.ok){out.textContent=S.gb_sent;gf.elements["body"].value="";}else out.textContent=d.err==='rate'?S.gb_rate:d.err==='short'?S.gb_short:S.gb_err})
      .catch(function(){out.textContent=S.gb_err}).then(function(){b.disabled=false})};
  }
  // referral page: create a personal link, show it, check progress by secret
  var rb=document.getElementById('refbox');
  if(rb){
    var RS=JSON.parse(rb.dataset.strings),RAPI='https://stats.mahjongx.net/r/',rl=rb.dataset.lang,rout=document.getElementById('refout'),qout=document.getElementById('refqout'),qin=document.getElementById('refq');
    function fill(t,v,r){return t.replace('{v}',v).replace('{r}',r)}
    function showMine(code,secret){document.getElementById('refmine').hidden=false;document.getElementById('reflink').value=rb.dataset.base+'?r='+code;document.getElementById('refsecret').textContent=secret;document.getElementById('refget').hidden=true;qin.value=secret}
    function check(secret,el){fetch(RAPI+'q?s='+encodeURIComponent(secret)).then(function(r){return r.json()}).then(function(d){if(!d.ok){el.textContent=d.err==='notfound'||d.err==='bad'?RS.ref_notfound:RS.ref_err;return}el.textContent=fill(RS.ref_stats,d.visitors,d.readers);var got=RS.tiers.filter(function(t){return d.readers>=t[0]}),nx=RS.tiers.filter(function(t){return d.readers<t[0]})[0],pr=document.createElement('span');pr.className='prog';pr.textContent=(got.length?RS.ref_reached.replace('{prize}',got[got.length-1][1])+'　':'')+(nx?RS.ref_next.replace('{n}',nx[0]-d.readers).replace('{prize}',nx[1]):RS.ref_done);el.appendChild(pr)}).catch(function(){el.textContent=RS.ref_err})}
    var saved=null;try{saved=JSON.parse(get('qb-ref-mine')||'null')}catch(e){}
    if(saved){showMine(saved.code,saved.secret);check(saved.secret,rout)}
    document.getElementById('refget').onclick=function(){var b=this;b.disabled=true;rout.textContent='';
      fetch(RAPI+'new',{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({lang:rl})}).then(function(r){return r.json()}).then(function(d){
        if(d.ok){set("qb-ref-mine",JSON.stringify({code:d.code,secret:d.secret}));showMine(d.code,d.secret);check(d.secret,rout)}else rout.textContent=d.err==='rate'?RS.ref_rate:RS.ref_err}).catch(function(){rout.textContent=RS.ref_err}).then(function(){b.disabled=false})};
    document.getElementById('refcopy').onclick=function(){var i=document.getElementById('reflink'),b=this;i.select();(navigator.clipboard?navigator.clipboard.writeText(i.value):Promise.reject()).catch(function(){document.execCommand('copy')}).then(function(){var o=b.textContent;b.textContent=RS.ref_copied;setTimeout(function(){b.textContent=o},1500)})};
    document.getElementById('refqbtn').onclick=function(){var v=qin.value.trim().toUpperCase();if(v)check(v,qout)};
  }
  // Visitor count (stats.mahjongx.net). People are counted per browser via a random id kept in this browser
  // (no personal data), so a changing IP does not count one reader twice. A view is sent only after
  // 3 seconds of visible time or a real interaction, which keeps most page-fetching robots out.
  // ?me=1 marks this device as the author's (never counted); ?me=0 undoes it.
  var me=false,uid=null,rc=null,ch=null;
  try{var qs=new URLSearchParams(location.search);
    if(qs.get('me')==='1'){set('qb-me','1');var tip=document.createElement('div');tip.textContent='本设备已设为作者设备：访问不计入统计';tip.style.cssText='position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:#0f1530;color:#f1d99c;padding:10px 16px;border-radius:8px;z-index:99;font-size:14px';document.body.appendChild(tip);setTimeout(function(){tip.remove()},5000)}
    if(qs.get('me')==='0'){try{localStorage.removeItem('qb-me')}catch(e){}}
    me=get('qb-me')==='1'||location.hostname!=='novel.mahjongx.net';  // local previews never count
    uid=get('qb-uid');if(!uid||!/^[a-z0-9]{12,32}$/.test(uid)){uid='';var a=new Uint8Array(12);crypto.getRandomValues(a);for(var i=0;i<12;i++)uid+=('0'+a[i].toString(36)).slice(-2);set('qb-uid',uid)}
    var cq=(qs.get('c')||'').toLowerCase();ch=get('qb-ch');if(!ch&&/^[a-z0-9_-]{1,20}$/.test(cq)){ch=cq;set('qb-ch',ch)}
    var q=qs.get('r');rc=get('qb-rc');if(!rc&&q&&/^[A-HJ-NP-Z2-9]{6}$/.test(q.toUpperCase())){rc=q.toUpperCase();set('qb-rc',rc)}
  }catch(e){}
  var vid=Math.random().toString(36).slice(2,10)+Date.now().toString(36),sec=0,depth=0,lastAct=Date.now(),sent=false,seen=0;
  function post(url,obj){var d=JSON.stringify(obj);try{if(navigator.sendBeacon)navigator.sendBeacon(url,d);else fetch(url,{method:'POST',body:d,keepalive:true,mode:'no-cors'})}catch(e){}}
  function hit(){if(sent)return;sent=true;
    if(me){post('https://stats.mahjongx.net/h',{me:1,u:uid});return}   // author's device: tells the server to ignore this device and network
    post('https://stats.mahjongx.net/h',{p:location.pathname,r:document.referrer,rc:rc,v:vid,u:uid,c:ch})}
  if(me)hit();
  function act(){lastAct=Date.now();hit()}
  ['scroll','mousemove','keydown','touchstart','click'].forEach(function(ev){addEventListener(ev,act,{passive:true})});
  function measure(){var de=document.documentElement,h=de.scrollHeight-innerHeight;var p=h>0?Math.round(scrollY/h*100):100;if(p>depth)depth=Math.min(100,p)}
  addEventListener('scroll',measure,{passive:true});setTimeout(measure,1500);
  setInterval(function(){if(document.visibilityState==='visible'){seen++;if(seen>=3)hit()}},1000);
  // time on page: counts only while the tab is visible and the reader was active in the last 2 minutes
  setInterval(function(){if(document.visibilityState==='visible'&&Date.now()-lastAct<120000)sec+=5},5000);
  function flush(){if(!sent||me||sec<1)return;post('https://stats.mahjongx.net/t',{v:vid,s:sec,d:depth})}
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')flush()});
  addEventListener('pagehide',flush);setInterval(flush,60000);

  // Map viewer: drag to pan, wheel / pinch / double-tap / buttons to zoom; swaps in the _hd image when zoomed.
  [].forEach.call(document.querySelectorAll('.mapview'),function(box){
    var img=box.querySelector('img'),bar=box.parentNode.querySelector('.mapbar'),iw=+img.getAttribute('width'),ih=+img.getAttribute('height');
    var base=1,s=1,x=0,y=0,pts={},last=null,startD=0,startS=1,tapT=0,hdOn=false,MAX=6;
    function size(){var w=box.clientWidth,h=Math.min(w*ih/iw,window.innerHeight*0.8);box.style.height=h+'px';base=Math.min(w/iw,h/ih);img.style.width=iw*base+'px';img.style.height=ih*base+'px';clamp();draw()}
    function clamp(){var w=box.clientWidth,h=box.clientHeight,dw=iw*base*s,dh=ih*base*s;x=dw<=w?(w-dw)/2:Math.min(0,Math.max(w-dw,x));y=dh<=h?(h-dh)/2:Math.min(0,Math.max(h-dh,y))}
    function draw(){img.style.transform='translate('+x+'px,'+y+'px) scale('+s+')';box.classList.toggle('zoomed',s>1.01);if(s>1.5&&!hdOn){hdOn=true;var hi=new Image();hi.onload=function(){img.src=hi.src};hi.src=box.dataset.hd}}
    function zoomAt(ns,cx,cy){ns=Math.max(1,Math.min(MAX,ns));x=cx-(cx-x)*ns/s;y=cy-(cy-y)*ns/s;s=ns;clamp();draw()}
    function rel(e){var r=box.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]}
    box.addEventListener('wheel',function(e){if(s<=1.001&&e.deltaY>0)return;e.preventDefault();var p=rel(e);zoomAt(s*Math.exp(-e.deltaY*0.0015),p[0],p[1])},{passive:false});
    box.addEventListener('pointerdown',function(e){pts[e.pointerId]=rel(e);var k=Object.keys(pts);
      if(k.length===2){var a=pts[k[0]],b=pts[k[1]];startD=Math.hypot(a[0]-b[0],a[1]-b[1]);startS=s;last=null}
      else if(s>1.01||e.pointerType==='mouse'){last=pts[e.pointerId];box.setPointerCapture(e.pointerId);box.classList.add('drag')}
      var now=Date.now();if(k.length===1&&now-tapT<300){var p=pts[e.pointerId];zoomAt(s>1.5?1:2.5,p[0],p[1]);tapT=0}else tapT=now});
    box.addEventListener('pointermove',function(e){if(!pts[e.pointerId])return;pts[e.pointerId]=rel(e);var k=Object.keys(pts);
      if(k.length===2&&startD){var a=pts[k[0]],b=pts[k[1]];e.preventDefault();zoomAt(startS*Math.hypot(a[0]-b[0],a[1]-b[1])/startD,(a[0]+b[0])/2,(a[1]+b[1])/2)}
      else if(last){var p=pts[e.pointerId];x+=p[0]-last[0];y+=p[1]-last[1];last=p;clamp();draw()}});
    function up(e){delete pts[e.pointerId];if(Object.keys(pts).length<2)startD=0;last=null;box.classList.remove('drag')}
    box.addEventListener('pointerup',up);box.addEventListener('pointercancel',up);box.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse')up(e)});
    box.addEventListener('keydown',function(e){var w=box.clientWidth/2,h=box.clientHeight/2;if(e.key==='+'||e.key==='=')zoomAt(s*1.4,w,h);else if(e.key==='-')zoomAt(s/1.4,w,h);else if(e.key==='0')zoomAt(1,w,h);else return;e.preventDefault()});
    if(bar)bar.addEventListener('click',function(e){var z=e.target.dataset&&e.target.dataset.z,w=box.clientWidth/2,h=box.clientHeight/2;if(z==='in')zoomAt(s*1.6,w,h);else if(z==='out')zoomAt(s/1.6,w,h);else if(z==='reset')zoomAt(1,w,h)});
    addEventListener('resize',size);size();
  });

  var fc=document.getElementById('feedcopy');
  if(fc)fc.onclick=function(){var i=document.getElementById('feedurl'),b=this;i.select();(navigator.clipboard?navigator.clipboard.writeText(i.value):Promise.reject()).catch(function(){document.execCommand('copy')}).then(function(){var o=b.textContent;b.textContent=b.dataset.ok;setTimeout(function(){b.textContent=o},1500)})};

  // a language picked from the menu is remembered, so the first-visit auto-switch never overrides it
  document.querySelectorAll('#langmenu .pop a').forEach(function(a){a.addEventListener('click',function(){set('qb-lang',a.dataset.zh?'zh':(a.getAttribute('lang')||'').slice(0,2))})});
})();
