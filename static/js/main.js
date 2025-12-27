import {
  fileInput,
  boxPreview,
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
} from "./core/dom.js";

import { debounce } from "./core/utils.js";
import { resetImageUI, resetSlider } from "./core/ui.js";
import { previewImage, updateResizeByRatio } from "./features/preview.js";
import { uploadImage } from "./features/upload.js";
import { filterImage } from "./features/filter.js";
import { adjustmentImage } from "./features/adjustment.js";
import { rotateImage } from "./features/rotate.js";
import { state } from "./core/state.js";
import { downloadImage } from "./features/download.js";
import { updateSlidersByMode } from "./features/sliders.js";

const debouncedAdjustment = debounce(adjustmentImage, 400);
const debouncedRotate = debounce(() => {
  rotateImage(state.rotate);
}, 400);

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

boxPreview.addEventListener("click", () => fileInput.click());

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
