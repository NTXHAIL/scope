export const MAX_IMAGE_PHOTOS = 60;
export const MAX_VIDEOS = 6;
export const MAX_VIDEO_BYTES = 80 * 1024 * 1024;

function canvasBlob(image, maxEdge, quality) {
  const scale = Math.min(1, maxEdge / Math.max(image.width, image.height, 1));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, width, height);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject(new Error("compress"));
      else resolve(blob);
    }, "image/jpeg", quality);
  });
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("unreadable"));
    };
    image.src = url;
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function compressImageFile(file) {
  const image = await loadImage(file);
  let blob = await canvasBlob(image, 1600, 0.72);
  if (blob.size > 450000) {
    const smaller = await canvasBlob(image, 1280, 0.6);
    if (smaller.size < blob.size) blob = smaller;
  }
  const thumbBlob = await canvasBlob(image, 480, 0.66);
  const thumb = await blobToDataUrl(thumbBlob);
  return { blob, thumb };
}
