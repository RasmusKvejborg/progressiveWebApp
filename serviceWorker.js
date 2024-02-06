// importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.3.0/workbox-sw.js');

const cacheName = "cache-v2" // tilføj v++ hver gang man ændrer noget
const assets = ['/', '/index.html', './manifest.json', './icons/manifest-icon-192.maskable.png', 'logo.png'] // cache alle js og css

// workbox.routing.registerRoute(
//     ({request}) => request.destination === 'image',
//     new workbox.strategies.CacheFirst() // prøver at hente fra cashe hvis der findes noget, i stedet for workbox.
//     // Det er godt til filer, der ikke skifter så ofte, såsom billeder.
//     // alternativet er NetworkFirst, så den først kigger på nettet, og hvis ikke der er net, så kigger den i cachen.
// )

// når serviceworkeren installerer, skal det her ske. Men sker kun hvis man ændrer navnet på cache-v1
self.addEventListener('install', (e) => {
    console.log('Service worker installing...');
    e.waitUntil( // service workeren tager ikke lang tid at installere. Waituntil sørger for at holde listener åben indtil installed
        caches.open(cacheName).then((cache) => { // opens the cache if it exists, ellers creates den
            console.log("caching shell assets")
            return cache.addAll(assets);
        })
    );
});

self.addEventListener('activate', e => {    // sletter den gamle cache når der er kommet en ny.
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key=> key !== cacheName).map(key => caches.delete(key)) // sletter alle caches der ikke har samme navn som den nyeste version.
            )
        })
    )
})


// fetch prøver at hente fra cachen først.
self.addEventListener('fetch', (e) => {
 e.respondWith( // i stedet for fetch event, så vælger vi lige hvad den skal svare med.
     caches.match(e.request).then(cacheResponse => {
         return cacheResponse || fetch(e.request);
     })
 )
});
