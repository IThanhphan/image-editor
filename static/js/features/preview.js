import { imgView, uploadContent, resizeWidthInput, resizeHeightInput, keepRatioCheckbox } from "../core/dom.js";
import { state } from "../core/state.js";
import { loadImage } from "../core/utils.js";

export function previewImage(file) {
  if (!file || !file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    imgView.src = e.target.result;
    imgView.style.display = "block";
    uploadContent.style.display = "none";

    loadImage(e.target.result, (img) => {
      state.originalWidth = img.width;
      state.originalHeight = img.height;
      resizeWidthInput.value = img.width;
      resizeHeightInput.value = img.height;
    });
  };
  reader.readAsDataURL(file);
}

export function updateResizeByRatio(type) {
  if (!keepRatioCheckbox.checked || !imgView.src) return;

  loadImage(imgView.src, (img) => {
    if (type === "width") {
      resizeHeightInput.value = Math.round(
        (resizeWidthInput.value * img.height) / img.width
      );
    } else {
      resizeWidthInput.value = Math.round(
        (resizeHeightInput.value * img.width) / img.height
      );
    }
  });
}
