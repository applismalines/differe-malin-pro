const CACHE='differe-malin-pro-v9';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./icon-monochrome-512.png',
  './polices/atkinson-400.woff2','./polices/atkinson-700.woff2','./polices/bricolage.woff2','./polices/share-tech-mono.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&(k.startsWith(CACHE.replace(/\d+$/,''))||/^differe-malin-v\d+$/.test(k))).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  // Couleur Tempo : toujours le réseau, jamais le cache
  if(url.hostname.endsWith('calendrier-tempo.fr'))return;
  if(url.origin!==location.origin)return;
  // Appli : réseau d'abord pour recevoir les mises à jour, cache hors ligne
  e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));return r})
    .catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
});
