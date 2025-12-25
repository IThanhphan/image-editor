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
} from "./core/dom.js";

import { debounce } from "./core/utils.js";
import { previewImage, updateResizeByRatio } from "./features/preview.js";
import { uploadImage } from "./features/upload.js";
import { filterImage } from "./features/filter.js";
import { rotateImage, RotateFeature } from "./features/rotate.js";
import { downloadImage } from "./features/download.js";
import { updateSlidersByMode } from "./features/sliders.js";

const debouncedFilter = debounce(filterImage, 400);

modeSelect.addEventListener("change", () => {
  updateSlidersByMode(modeSelect.value);
  filterImage();
});

brightnessSlider.addEventListener("input", debouncedFilter);
blurSlider.addEventListener("input", debouncedFilter);

resizeWidthInput.addEventListener("input", () => updateResizeByRatio("width"));
resizeHeightInput.addEventListener("input", () =>
  updateResizeByRatio("height")
);

downloadBtn.addEventListener("click", downloadImage);

boxPreview.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  modeSelect.value = "original";
  updateSlidersByMode("original");
  previewImage(fileInput.files[0]);
  uploadImage();
});

const rotate = new RotateFeature();
rotateActionBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;

    if (action === "rotate-left") rotate.rotateLeft();
    if (action === "rotate-right") rotate.rotateRight();
    if (action === "flip-x") rotate.flipX();
    if (action === "flip-y") rotate.flipY();

    rotateSlider.value = rotate.state.angle;
    rotateValueText.textContent = `${rotate.state.angle}°`;

    rotateImage(fileInput.files[0], rotate);
  });
});

const debouncedRotate = debounce(() => {
  rotateImage(fileInput.files[0], rotate);
}, 400);
rotateSlider.addEventListener("input", () => {
  rotateValueText.textContent = `${rotateSlider.value}°`;
  rotate.setRotate(Number(rotateSlider.value));
  debouncedRotate();
});

updateSlidersByMode("original");
