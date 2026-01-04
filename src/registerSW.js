


// export function registerSW() {
//   if ("serviceWorker" in navigator) {
//     window.addEventListener("load", () => {
//       navigator.serviceWorker.register("/sw.js");
//     });
//   }
// }


export function registerSW() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          console.log("✅ Service Worker registrado");
        })
        .catch((err) => {
          console.error("❌ Falha ao registrar Service Worker", err);
        });
    });
  }
}
