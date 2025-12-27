import { imgView, resizeWidthInput, resizeHeightInput, keepRatioCheckbox, formatSelect, modeFilterSelect } from "../core/dom.js";
import { loadImage, triggerDownload } from "../core/utils.js";

export function downloadImage() {
  if (!imgView.src) return alert("Chưa có ảnh");

  const format = formatSelect.value;
  const targetW = parseInt(resizeWidthInput.value);
  const targetH = parseInt(resizeHeightInput.value);
  const keepRatio = keepRatioCheckbox.checked;

  loadImage(imgView.src, (img) => {
    let w = img.width;
    let h = img.height;

    if (targetW || targetH) {
      if (keepRatio) {
        const ratio = img.width / img.height;
        if (targetW) {
          w = targetW;
          h = Math.round(targetW / ratio);
        } else {
          h = targetH;
          w = Math.round(targetH * ratio);
        }
      } else {
        w = targetW || w;
        h = targetH || h;
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (format === "jpg") {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
    }

    ctx.drawImage(img, 0, 0, w, h);
    const mime = `image/${format === "jpg" ? "jpeg" : format}`;

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      triggerDownload(url, `image_${modeFilterSelect.value}_${w}x${h}.${format}`);
      URL.revokeObjectURL(url);
    }, mime, 0.95);
  });
}
