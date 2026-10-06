/* زرار ملء الشاشة المشترك لكل الألعاب */
(function(){
  var d=document,root=d.documentElement;
  var req=root.requestFullscreen||root.webkitRequestFullscreen;
  var standalone=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone;
  if(standalone)return;

  var ICON={
    expand:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    shrink:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>'
  };

  var css=d.createElement('style');
  css.textContent=
   '#fsx{position:fixed;bottom:calc(14px + env(safe-area-inset-bottom,0px));left:14px;z-index:2147483000;width:48px;height:48px;padding:0;border-radius:16px;border:1px solid rgba(255,255,255,.28);color:#fff;cursor:pointer;display:grid;place-items:center;'
  +'background:linear-gradient(145deg,rgba(40,44,70,.78),rgba(10,12,28,.78));box-shadow:0 6px 18px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.22);'
  +'-webkit-backdrop-filter:blur(10px) saturate(1.4);backdrop-filter:blur(10px) saturate(1.4);opacity:.92;transition:opacity .35s,transform .18s,box-shadow .18s,background .2s;-webkit-tap-highlight-color:transparent}'
  +'#fsx svg{display:block;transition:transform .25s cubic-bezier(.2,1.5,.4,1)}'
  +'#fsx:hover{transform:translateY(-2px);box-shadow:0 10px 22px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.28)}'
  +'#fsx:hover svg{transform:scale(1.18)}'
  +'#fsx:active{transform:scale(.9)}'
  +'#fsx.idle{opacity:.38}'
  +'#fsx:focus-visible{outline:3px solid #fff;outline-offset:3px;opacity:1}'
  +'#fsx.on{background:linear-gradient(145deg,rgba(255,255,255,.9),rgba(220,225,240,.85));color:#12162e;border-color:rgba(255,255,255,.9)}'
  +'#fsx-t{position:fixed;left:14px;bottom:calc(72px + env(safe-area-inset-bottom,0px));transform:translateY(14px);opacity:0;z-index:2147483001;max-width:min(86vw,340px);background:#fff;color:#12162e;font:700 15px/1.7 Cairo,Tahoma,sans-serif;text-align:right;padding:12px 16px;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.4);pointer-events:none;transition:opacity .25s,transform .25s}'
  +'#fsx-t.on{opacity:1;transform:none}'
  +'@media (prefers-reduced-motion:reduce){#fsx,#fsx svg,#fsx-t{transition:none}}';
  d.head.appendChild(css);

  var b=d.createElement('button');b.id='fsx';b.type='button';d.body.appendChild(b);
  var t=d.createElement('div');t.id='fsx-t';t.setAttribute('role','status');d.body.appendChild(t);
  var k;function tip(m){t.textContent=m;t.classList.add('on');clearTimeout(k);k=setTimeout(function(){t.classList.remove('on')},4500)}

  function isFs(){return !!(d.fullscreenElement||d.webkitFullscreenElement)}
  function paint(){
    var f=isFs();
    b.innerHTML=f?ICON.shrink:ICON.expand;
    b.classList.toggle('on',f);
    var l=f?'اخرج من ملء الشاشة':'املا الشاشة';
    b.setAttribute('aria-label',l);b.title=l;b.setAttribute('aria-pressed',String(f));
  }
  paint();
  d.addEventListener('fullscreenchange',paint);d.addEventListener('webkitfullscreenchange',paint);

  /* يبهت لما محدش بيلمس الشاشة، ويرجع واضح عند أي لمسة */
  var it;function wake(){b.classList.remove('idle');clearTimeout(it);it=setTimeout(function(){if(d.activeElement!==b)b.classList.add('idle')},3500)}
  ['pointerdown','pointermove','keydown'].forEach(function(ev){d.addEventListener(ev,wake,{passive:true})});
  wake();

  b.addEventListener('click',function(e){
    e.stopPropagation();
    if(!req){tip('الآيفون مابيدعمش ملء الشاشة من المتصفح. دوس زرار المشاركة ثم «إضافة إلى الشاشة الرئيسية» وافتح اللعبة منها.');return}
    try{
      if(isFs()){(d.exitFullscreen||d.webkitExitFullscreen).call(d)}
      else{var p=req.call(root,{navigationUI:'hide'});if(p&&p.catch)p.catch(function(){tip('المتصفح رفض ملء الشاشة. جرّب تاني.')})}
    }catch(x){tip('المتصفح رفض ملء الشاشة.')}
  });
})();