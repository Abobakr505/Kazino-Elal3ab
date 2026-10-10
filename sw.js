/* Service Worker: كازينو الألعاب
   غيّر رقم النسخة (VER) كل ما تعدّل ملفات كتير عشان الكاش القديم يتمسح */
var VER = 'casino-v1';

var CORE = [
  './',
  'index.html',
  'manifest.json',
  'icon.png',
  'icon-192.png',
  'icon-512.png',
  'games/fullscreen.js',
  'games/bomb/index.html',
  'games/truth-or-dare/index.html',
  'games/charades/index.html',
  'games/emoji/index.html',
  'games/bkasa/index.html',
  'games/harf/index.html',
  'games/tfkek/index.html',
  'games/kalmat/index.html',
  'games/court/index.html'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(VER).then(function(cache){
      /* لو ملف ناقص ما يوقفش التثبيت كله */
      return Promise.all(CORE.map(function(u){ return cache.add(u).catch(function(){}); }));
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== VER; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

function save(req, res){
  if(res && (res.ok || res.type === 'opaque')){
    var copy = res.clone();
    caches.open(VER).then(function(c){ c.put(req, copy); });
  }
  return res;
}

self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET' || req.headers.has('range')) return;
  if(!/^https?:/.test(req.url)) return;

  /* الصفحات: الشبكة الأول (عشان التحديثات توصل)، ولو أوفلاين من الكاش */
  if(req.mode === 'navigate'){
    e.respondWith(
      fetch(req).then(function(res){ return save(req, res); }).catch(function(){
        return caches.match(req, { ignoreSearch: true }).then(function(hit){
          return hit || caches.match('index.html');
        });
      })
    );
    return;
  }

  /* باقي الملفات (سكربتات، خطوط، صور): من الكاش فوراً وتتحدّث في الخلفية */
  e.respondWith(
    caches.match(req).then(function(hit){
      var net = fetch(req).then(function(res){ return save(req, res); }).catch(function(){ return hit; });
      return hit || net;
    })
  );
});