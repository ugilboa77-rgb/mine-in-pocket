// Service worker (spec 6.0): caches every game file on first load, then works without network.
const CACHE = 'mip-mwnuvaj1';
const FILES = ["./","answer-key.enc","assets/img/chip-happy.webp","assets/img/chip-oops.webp","assets/img/chip-think.webp","assets/img/chip-wave.webp","assets/img/noga-chee.webp","assets/img/noga-inst.webp","assets/img/noga-think.webp","assets/img/p00.webp","assets/img/p01.webp","assets/img/p02.webp","assets/img/p10.webp","assets/img/p11.webp","assets/img/p20.webp","assets/img/p21.webp","assets/img/p22.webp","assets/img/p30.webp","assets/img/p31.webp","assets/img/p32.webp","assets/img/p33.webp","assets/img/p40.webp","assets/img/p41.webp","assets/img/p50.webp","assets/img/p51.webp","assets/img/p52.webp","assets/img/p53.webp","assets/img/s1.webp","assets/img/s2.webp","assets/img/s3.webp","assets/img/s4.webp","assets/img/s5.webp","assets/index-DFq5VTvL.js","assets/index-DYaLyC6g.css","assets/karantina-hebrew-700-normal-C9VKSFl2.woff","assets/karantina-hebrew-700-normal-CEidegjC.woff2","assets/photos/layer-bottom-granite-mag.webp","assets/photos/layer-middle-sandstone-mag.webp","assets/photos/layer-top-gir-mag.webp","assets/photos/metal-aluminum.webp","assets/photos/metal-copper.webp","assets/photos/metal-iron.webp","assets/photos/metal-wood.webp","assets/photos/rock-basalt-mag.webp","assets/photos/rock-basalt.webp","assets/photos/rock-gir-mag.webp","assets/photos/rock-gir.webp","assets/photos/rock-granite-mag.webp","assets/photos/rock-granite.webp","assets/photos/rock-kurkar-mag.webp","assets/photos/rock-kurkar.webp","assets/photos/rock-tsur-mag.webp","assets/photos/rock-tsur.webp","assets/photos/test-gir-lemon.webp","assets/rubik-hebrew-400-normal-BQDoxs6C.woff","assets/rubik-hebrew-400-normal-Dp0lvSRB.woff2","assets/rubik-hebrew-600-normal-BGAyptFf.woff","assets/rubik-hebrew-600-normal-CpCbvE17.woff2","assets/rubik-latin-400-normal-BV1Ho3GG.woff","assets/rubik-latin-400-normal-j0pmKyiQ.woff2","assets/rubik-latin-600-normal-7iWW07_k.woff2","assets/rubik-latin-600-normal-Bd1rsTk4.woff","assets/video/anim-01-opening.mp4","assets/video/anim-02-timna.mp4","assets/video/anim-03-twist.mp4","assets/video/test-sandstone-lemon.mp4","content.json","credits.html","favicon.svg","index.html"];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('mip-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // video range requests: serve the whole cached file
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => {
      if (res.ok && res.status === 200) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match('./'))),
  );
});
