import {
  fileInput,
  boxPreview,
  modeSelect,
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
} from "./core/dom.js";

import { debounce } from "./core/utils.js";
import { resetImageUI } from "./core/ui.js";
import { previewImage, updateResizeByRatio } from "./features/preview.js";
import { uploadImage } from "./features/upload.js";
import { filterImage } from "./features/filter.js";
import { rotateImage } from "./features/rotate.js";
import { state } from "./core/state.js";
import { downloadImage } from "./features/download.js";
import { updateSlidersByMode } from "./features/sliders.js";

const debouncedFilter = debounce(filterImage, 400);
const debouncedRotate = debounce(() => {
  rotateImage(state.rotate);
}, 400);

fileInput.addEventListener("change", () => {
  modeSelect.value = "original";
  updateSlidersByMode("original");
  previewImage(fileInput.files[0]);
  uploadImage();
  resetImageUI();
});

modeSelect.addEventListener("change", () => {
  updateSlidersByMode(modeSelect.value);
  if (modeSelect.value == "original") {
    brightnessValueText.textContent = brightnessSlider.value = 1.0;
    blurValueText.textContent = blurSlider.value = 15;
  } else if (modeSelect.value == "gray") {
    brightnessValueText.textContent = brightnessSlider.value = 1.0;
    blurValueText.textContent = blurSlider.value = 15;
  } else if (modeSelect.value == "bright")
    blurValueText.textContent = blurSlider.value = 15;
  else if (modeSelect.value == "blur")
    brightnessValueText.textContent = brightnessSlider.value = 1.0;
  filterImage();
});

brightnessSlider.addEventListener("input", () => {
  brightnessValueText.textContent = brightnessSlider.value;
  debouncedFilter();
});
blurSlider.addEventListener("input", () => {
  blurValueText.textContent = blurSlider.value;
  debouncedFilter();
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
