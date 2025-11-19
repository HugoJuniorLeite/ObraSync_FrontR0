// src/components/RDO/GasitaOperacoes/helpers/location.js
export const getLocation = () => new Promise((resolve) => {
  if (!navigator.geolocation) return resolve(null);
  navigator.geolocation.getCurrentPosition(
    pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
    () => resolve(null),
    { enableHighAccuracy: true, timeout: 8000 }
  );
});