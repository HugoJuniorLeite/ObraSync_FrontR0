// 

let lastPosition = null;
let lastPositionTime = 0;

/**
 * Obtém localização com estratégia híbrida:
 * - Tenta GPS real (alta precisão)
 * - Cai para cache se necessário
 * - Nunca trava o fluxo
 */
export const getLocation = (options = {}) =>
  new Promise((resolve) => {
    const {
      useCache = true,
      cacheMs = 20_000,
      highAccuracy = false, // 🔥 CONTROLE EXPLÍCITO
    } = options;

    if (!navigator.geolocation) {
      return resolve(lastPosition);
    }

    const now = Date.now();

    // ✅ Cache válido
    if (useCache && lastPosition && now - lastPositionTime < cacheMs) {
      return resolve(lastPosition);
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const gps = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy, // 🔥 MUITO IMPORTANTE
        };

        lastPosition = gps;
        lastPositionTime = Date.now();

        resolve(gps);
      },
      () => {
        // ❌ erro → fallback silencioso
        resolve(lastPosition);
      },
      {
        enableHighAccuracy: highAccuracy,
        timeout: highAccuracy ? 10_000 : 5_000,
        maximumAge: highAccuracy ? 0 : 30_000,
      }
    );
  });
