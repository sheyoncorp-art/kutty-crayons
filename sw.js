const CACHE="kutty-games-v11";
const CORE=["./","index.html","crayons/","crayons/index.html","kitchen/","kitchen/index.html","brain/","brain/index.html","numbers/","numbers/index.html","letters/","letters/index.html","puzzle/","puzzle/index.html","flight/","flight/index.html","chop/","chop/index.html","spot/","spot/index.html","maze/","maze/index.html","copy/","copy/index.html","compare/","compare/index.html","shared/kit.js","shared/kit.css","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request).then(hit=>{
    const net=fetch(e.request).then(r=>{if(r&&(r.ok||r.type==="opaque")){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}return r}).catch(()=>hit);
    return hit||net;
  }));
});
