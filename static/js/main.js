import {
  fileInput,
  boxPreview,
  modeSelect,
  brightnessSlider,
  blurSlider,
  resizeWidthInput,
  resizeHeightInput,
  downloadBtn
} from "./core/dom.js";

import { debounce } from "./core/utils.js";
import { previewImage, updateResizeByRatio } from "./features/preview.js";
import { uploadImage } from "./features/upload.js";
import { downloadImage } from "./features/download.js";
import { updateSlidersByMode } from "./features/sliders.js";

const debouncedUpload = debounce(uploadImage, 400);

modeSelect.addEventListener("change", () => {
  updateSlidersByMode(modeSelect.value);
  uploadImage();
});

brightnessSlider.addEventListener("input", debouncedUpload);
blurSlider.addEventListener("input", debouncedUpload);

resizeWidthInput.addEventListener("input", () => updateResizeByRatio("width"));
resizeHeightInput.addEventListener("input", () => updateResizeByRatio("height"));

downloadBtn.addEventListener("click", downloadImage);

boxPreview.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  modeSelect.value = "original";
  updateSlidersByMode("original");
  previewImage(fileInput.files[0]);
  uploadImage();
});

updateSlidersByMode("original");
