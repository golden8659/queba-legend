(function(){
  var root=document.documentElement;
  function get(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function set(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  // night mode
  var t=get('qb-theme');if(t)root.dataset.theme=t;
  var tb=document.getElementById('theme');
  if(tb)tb.onclick=function(){var dark=getComputedStyle(root).getPropertyValue('--bg').trim()==='#0d1122';root.dataset.theme=dark?'light':'dark';set('qb-theme',root.dataset.theme)};
  // font size
  var s=parseInt(get('qb-size')||'19',10);root.style.setProperty('--size',s+'px');
  document.querySelectorAll('[data-size]').forEach(function(b){b.onclick=function(){s=Math.min(26,Math.max(15,s+parseInt(b.dataset.size,10)*2));root.style.setProperty('--size',s+'px');set('qb-size',s)}});
  // simplified / traditional
  var zb=document.getElementById('zh'),orig=null;
  function walk(fn){var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),n,i=0;while(n=w.nextNode()){if(n.parentNode.tagName==="BUTTON")continue;fn(n,i++)}}
  function apply(trad){
    if(!window.OpenCC){zb.textContent=trad?'简':'繁';return}
    if(!orig){orig=[];walk(function(n){orig.push(n.nodeValue)})}
    var conv=window.OpenCC.Converter({from:'cn',to:'tw'});
    walk(function(n,i){n.nodeValue=trad?conv(orig[i]):orig[i]});
    zb.textContent=trad?'简':'繁';
  }
  var trad=get('qb-zh')==='t';
  window.addEventListener('load',function(){if(trad)apply(true)});
  if(zb)zb.onclick=function(){trad=!trad;set('qb-zh',trad?'t':'s');apply(trad)};
  // visitor count (stats.mahjongx.net stores only a salted hash of the IP)
  try{var d=JSON.stringify({p:location.pathname,r:document.referrer});if(navigator.sendBeacon)navigator.sendBeacon('https://stats.mahjongx.net/h',d);else fetch('https://stats.mahjongx.net/h',{method:'POST',body:d,keepalive:true,mode:'no-cors'})}catch(e){}
})();
