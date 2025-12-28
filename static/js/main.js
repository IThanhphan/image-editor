import {
  fileInput,
  boxPreview,
  imgView,
  modeFilterSelect,
  modeAdjustmentSelect,
  brightnessSlider,
  blurSlider,
  resizeWidthInput,
  resizeHeightInput,
  downloadBtn,
  rotateActionBtns,
  rotateSlider,
  rotateValueText,
  brightnessValueText,
  blurValueText,
  sharpnessSlider,
  sharpnessValueText,
  contrastSlider,
  contrastValueText,
  colorSlider,
  colorValueText,
  removeBgBtn,
  cropBox,
  cropBtn,
  cropConfirmBtn,
} from "./core/dom.js";

import { debounce } from "./core/utils.js";
import { resetImageUI, resetSlider } from "./core/ui.js";
import { previewImage, updateResizeByRatio } from "./features/preview.js";
import { uploadImage } from "./features/upload.js";
import { filterImage } from "./features/filter.js";
import { adjustmentImage } from "./features/adjustment.js";
import { removeBgImage } from "./features/removeBg.js";
import { rotateImage } from "./features/rotate.js";
import { cropImage } from "./features/crop.js";
import { state } from "./core/state.js";
import { downloadImage } from "./features/download.js";
import { updateSlidersByMode } from "./features/sliders.js";

let isCropping = false;
let startX = 0,
  startY = 0;
let cropData = null;
const debouncedAdjustment = debounce(adjustmentImage, 400);
const debouncedRotate = debounce(() => {
  rotateImage(state.rotate);
}, 400);

cropBtn.addEventListener("click", () => {
  if (!imgView.src) return;
  if (cropBox.style.display === "block") {
    cropBox.style.display = "none";
    cropData = null;
    return;
  }

  const rect = imgView.getBoundingClientRect();
  const parentRect = boxPreview.getBoundingClientRect();

  cropBox.style.display = "block";
  cropBox.style.left = rect.left - parentRect.left + "px";
  cropBox.style.top = rect.top - parentRect.top + "px";
  cropBox.style.width = rect.width + "px";
  cropBox.style.height = rect.height + "px";

  cropData = null;
});

boxPreview.addEventListener("mousedown", (e) => {
  if (cropBox.style.display !== "block") return;

  e.preventDefault();
  isCropping = true;

  const imgRect = imgView.getBoundingClientRect();
  const parentRect = boxPreview.getBoundingClientRect();

  startX = e.clientX - imgRect.left;
  startY = e.clientY - imgRect.top;

  cropBox.style.left = imgRect.left - parentRect.left + startX + "px";
  cropBox.style.top = imgRect.top - parentRect.top + startY + "px";

  cropBox.style.width = "0px";
  cropBox.style.height = "0px";
});

boxPreview.addEventListener("mousemove", (e) => {
  if (!isCropping) return;

  const imgRect = imgView.getBoundingClientRect();
  const parentRect = boxPreview.getBoundingClientRect();

  const currentX = e.clientX - imgRect.left;
  const currentY = e.clientY - imgRect.top;

  const x = Math.min(startX, currentX);
  const y = Math.min(startY, currentY);
  const w = Math.abs(currentX - startX);
  const h = Math.abs(currentY - startY);

  cropBox.style.left = imgRect.left - parentRect.left + x + "px";
  cropBox.style.top = imgRect.top - parentRect.top + y + "px";
  cropBox.style.width = w + "px";
  cropBox.style.height = h + "px";

  cropData = { x, y, w, h };
});

document.addEventListener("mouseup", (e) => {
  if (isCropping) {
    e.preventDefault();
    e.stopPropagation();
    isCropping = false;
    if (cropData && cropData.w > 5 && cropData.h > 5) {
      cropBox.classList.add("done");
    }
    console.log("Crop data:", cropData);
  }
});

cropConfirmBtn.addEventListener("mousedown", (e) => {
  e.stopPropagation();
});

cropConfirmBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  cropImage(cropData);
  cropBox.style.display = "none";
  cropBox.classList.remove("done");
  cropData = null;
});

fileInput.addEventListener("change", () => {
  modeFilterSelect.value = "original";
  modeAdjustmentSelect.value = "original";
  updateSlidersByMode("original");
  previewImage(fileInput.files[0]);
  uploadImage();
  resetImageUI();
});

modeFilterSelect.addEventListener("change", () => {
  filterImage();
});

modeAdjustmentSelect.addEventListener("change", () => {
  updateSlidersByMode(modeAdjustmentSelect.value);
  if (modeAdjustmentSelect.value == "original") {
    resetSlider();
  }
  adjustmentImage();
});

brightnessSlider.addEventListener("input", () => {
  brightnessValueText.textContent = brightnessSlider.value;
  debouncedAdjustment();
});
blurSlider.addEventListener("input", () => {
  blurValueText.textContent = blurSlider.value;
  debouncedAdjustment();
});
sharpnessSlider.addEventListener("input", () => {
  sharpnessValueText.textContent = sharpnessSlider.value;
  debouncedAdjustment();
});
contrastSlider.addEventListener("input", () => {
  contrastValueText.textContent = contrastSlider.value;
  debouncedAdjustment();
});
colorSlider.addEventListener("input", () => {
  colorValueText.textContent = colorSlider.value;
  debouncedAdjustment();
});

resizeWidthInput.addEventListener("input", () => updateResizeByRatio("width"));
resizeHeightInput.addEventListener("input", () =>
  updateResizeByRatio("height")
);

downloadBtn.addEventListener("click", downloadImage);

boxPreview.addEventListener("click", (e) => {
  if (
    cropBox.style.display === "block" ||
    isCropping ||
    cropBox.contains(e.target)
  ) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  fileInput.click();
});

removeBgBtn.addEventListener("click", removeBgImage);

rotateActionBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;

    if (action === "rotate-left") state.rotate.rotateLeft();
    if (action === "rotate-right") state.rotate.rotateRight();
    if (action === "flip-x") state.rotate.flipX();
    if (action === "flip-y") state.rotate.flipY();

    rotateSlider.value = state.rotate.state.angle;
    rotateValueText.textContent = `${state.rotate.state.angle}°`;

    rotateImage(state.rotate);
  });
});

rotateSlider.addEventListener("input", () => {
  rotateValueText.textContent = `${rotateSlider.value}°`;
  state.rotate.setRotate(Number(rotateSlider.value));
  debouncedRotate();
});

updateSlidersByMode("original");
