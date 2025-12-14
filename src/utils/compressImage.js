import imageCompression from "browser-image-compression";

export async function compressImage(file) {
  const options = {
    maxSizeMB: 0.5,          // ~500 KB
    maxWidthOrHeight: 1280,  // mais que suficiente p/ evidência
    useWebWorker: true,
  };

  return await imageCompression(file, options);
}
