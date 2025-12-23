export function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export function loadImage(src, callback) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => callback(img);
  img.src = src;
}

export function triggerDownload(src, filename) {
  const a = document.createElement("a");
  a.href = src;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
