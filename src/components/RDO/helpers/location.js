// 🔹 Mantém cache da última posição
let lastPosition = null;
let lastPositionTime = 0;

/**
 * Obtém a localização atual do usuário de forma otimizada.
 *
 * @param {Object} options
 * @param {boolean} options.useCache - Se true, reutiliza posição recente.
 * @param {number} options.cacheMs - Tempo máximo (ms) para considerar cache válido.
 */
export const getLocation = (options = {}) =>
  new Promise((resolve) => {
    const {
      useCache = true,
      cacheMs = 30_000, // 30s
    } = options;

    if (!navigator.geolocation) {
      return resolve(lastPosition);
    }

    const now = Date.now();

    // ✅ Se temos uma posição recente e o cache é permitido, retorna ela direto
    if (useCache && lastPosition && now - lastPositionTime < cacheMs) {
      return resolve(lastPosition);
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const gps = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        lastPosition = gps;
        lastPositionTime = Date.now();
        resolve(gps);
      },
      (err) => {
        console.warn("Erro no GPS:", err);
        // Em caso de erro, retorna a última posição conhecida (ou null)
        resolve(lastPosition);
      },
      {
        enableHighAccuracy: false, // ✅ mais rápido e suficiente para jornada
        timeout: 5000,             // ✅ no máximo 5s
        maximumAge: 30_000,        // ✅ reaproveita posição até 30s
      }
    );
  });