// const staticCasheName = "s-app-v1"
// const assetsURLs = [
//     "index.html",
//     "/src/App.js",
//     "/src/App.module.css"
// ]

// self.addEventListener("install",(event) => {
//     event.awitUntil(
//         caches.open(staticCasheName).then((cahe) => {
//             cahe.addAll(assetsURLs)
//         })
//     )
//     console.log("Worker was installed seccesfuly",event)
// })

// self.addEventListener("activate",(event) => {
//     alert("activate")
//     console.log("Worker ws activated",event)
// })

// self.addEventListener("fetch",(event) => {
//     console.log("fetch",event.request.url)
//     event.respondWith(caheFirst())
// })

// const caheFirst = async function (request) {
//     console.log("zslgerhgklzsjghkzesgh")
//     const cachedData = await caches.match(request)
//     return cachedData ?? await fetch(request)
// }