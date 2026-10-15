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
  function applyFont(v){font=v;root.dataset.font=v;set('qb-font',v);mark('[data-font]','data-font',v)}
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
  // Traditional Chinese (zh pages only): converts the page text in place with OpenCC.
  var zt=document.getElementById('zh-t'),orig=null,trad=get('qb-zh')==='t';
  function walk(fn){var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),n,i=0;while(n=w.nextNode()){if(n.parentNode.closest('.pop'))continue;fn(n,i++)}}
  function applyTrad(on){
    if(!window.OpenCC)return;
    if(!orig){orig=[];walk(function(n){orig.push(n.nodeValue)})}
    var conv=window.OpenCC.Converter({from:'cn',to:'tw'});
    walk(function(n,i){n.nodeValue=on?conv(orig[i]):orig[i]});
    root.lang=on?'zh-Hant':'zh-Hans';
    if(zt)zt.setAttribute('aria-current',on?'true':'false');
    var zs=document.querySelector('.pop a[lang="zh-Hans"]');if(zs){if(on)zs.removeAttribute('aria-current');else zs.setAttribute('aria-current','true')}
  }
  if(zt){
    window.addEventListener('load',function(){if(trad)applyTrad(true)});
    zt.onclick=function(){trad=true;set('qb-zh','t');applyTrad(true);document.getElementById('langmenu').open=false};
    var zs=document.querySelector('.pop a[lang="zh-Hans"]');
    if(zs&&root.dataset.lang==='zh')zs.onclick=function(e){if(trad){e.preventDefault();trad=false;set('qb-zh','s');applyTrad(false);document.getElementById('langmenu').open=false}};
  }
  // visitor count (stats.mahjongx.net stores only a salted hash of the IP)
  try{var d=JSON.stringify({p:location.pathname,r:document.referrer});if(navigator.sendBeacon)navigator.sendBeacon('https://stats.mahjongx.net/h',d);else fetch('https://stats.mahjongx.net/h',{method:'POST',body:d,keepalive:true,mode:'no-cors'})}catch(e){}
})();
