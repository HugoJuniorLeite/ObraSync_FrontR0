// export function registerSW() {
//   if ("serviceWorker" in navigator) {
//     navigator.serviceWorker.register("/sw.js");
//   }
// }

export function registerSW() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js");
    });
  }
}
