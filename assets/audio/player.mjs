export function initAudioPlayer(P,M,W){
 if(!P)return;var A=P.querySelector('audio'),ch=P.getAttribute('data-ch'),K='qb-listen-'+(P.dataset.track||'zh')+'-'+ch+'-'+(P.dataset.revision||'v1'),RK='qb-listen-rate';
 var play=P.querySelector('.pl-play'),rate=P.querySelector('.pl-rate'),bar=P.querySelector('.pl-bar'),tm=P.querySelector('.pl-time');
 var mplay=M&&M.querySelector('.pm-play'),mbar=M&&M.querySelector('.pm-bar');
 var R=[0.75,1,1.25,1.5,2],ri=1;try{var r=parseFloat(localStorage.getItem(RK));if(R.indexOf(r)>=0)ri=R.indexOf(r)}catch(e){}
 function label(el,text){var span=el.matches('[data-ink]')?el:el.querySelector('[data-ink]');if(!span){el.textContent=text;return}span.textContent=text;var c={"播放": [0.17, 0.83], "暂停": [0.33, 0.83], "0.75 倍": [0.5, 0.83], "1 倍": [1.0, 0.83], "1.25 倍": [1.0, 0.83], "1.5 倍": [1.0, 0.83], "2 倍": [0.17, 0.83], "音频待接": [0.0, -0.5], "加载失败": [0, 0]}[text];if(c){span.style.setProperty('--cxd',c[0]+'px');span.style.setProperty('--cyd',c[1]+'px');span.style.setProperty('--cxm',c[0]+'px');span.style.setProperty('--cym',c[1]+'px')}}
 function status(text){label(P.querySelector('.pl-head .tag'),text)}
 function fail(){A.pause();document.body.classList.remove('pl-started');P.classList.add('pending');status(W.failed)}
 A.addEventListener('error',fail);
 function fmt(t){t=Math.max(0,Math.floor(t||0));return ('0'+Math.floor(t/60)).slice(-2)+':'+('0'+t%60).slice(-2)}
 function setRate(){A.playbackRate=R[ri];label(rate,R[ri]+' ×');rate.style.setProperty('--ls','0px');rate.style.setProperty('--lsm','0px')}
 setRate();
 function sync(){var d=Number.isFinite(A.duration)?A.duration:0,p=d?A.currentTime/d*1000:0;[bar,mbar].forEach(function(b){if(b){b.value=p;b.style.setProperty('--p',p/10+'%')}});tm.textContent=fmt(A.currentTime)+' / '+(d?fmt(d):'--:--');
  var lab=A.paused?W.play:W.pause;label(play,lab);if(mplay)label(mplay,lab)}
 var last=0;A.addEventListener('timeupdate',function(){sync();if(Date.now()-last>3000){last=Date.now();try{localStorage.setItem(K,A.currentTime)}catch(e){}}});
 A.addEventListener('loadedmetadata',function(){try{var t=parseFloat(localStorage.getItem(K));if(t>0&&t<A.duration-5)A.currentTime=t}catch(e){}sync()});
 addEventListener('pagehide',function(){if(A.currentTime>0)try{localStorage.setItem(K,A.currentTime)}catch(e){}});A.addEventListener('play',sync);A.addEventListener('pause',function(){sync();try{localStorage.setItem(K,A.currentTime)}catch(e){}});
 function toggle(e){e.preventDefault();var src=A.getAttribute('data-src');if(!src){P.classList.add('pending');status(W.soon);play.setAttribute('aria-label',W.soon);return}   // 音频待接：不加载、不播放
  if(!A.getAttribute('src'))A.setAttribute('src',src);   // 点了才加载（preload=none）
  document.body.classList.add('pl-started');if(A.paused){var p=A.play();if(p&&p.catch)p.catch(fail)}else A.pause()}
 play.addEventListener('click',toggle);if(mplay)mplay.addEventListener('click',toggle);
 rate.addEventListener('click',function(e){e.preventDefault();ri=(ri+1)%R.length;setRate();try{localStorage.setItem(RK,R[ri])}catch(err){}});
 [bar,mbar].forEach(function(b){if(b)b.addEventListener('input',function(){if(Number.isFinite(A.duration)&&A.duration>0)A.currentTime=b.value/1000*A.duration;b.style.setProperty('--p',b.value/10+'%')})});
 // 只有点过播放、且播放条滚出屏幕时，才在底部收成细条；不听的读者永远看不到它，不挡正文
 if('IntersectionObserver' in window&&M)new IntersectionObserver(function(es){document.body.classList.toggle('pl-away',!es[0].isIntersecting)}).observe(P);
}