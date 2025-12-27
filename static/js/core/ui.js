import {
  modeFilterSelect,
  modeAdjustmentSelect,
  brightnessSlider,
  blurSlider,
  rotateSlider,
  rotateValueText,
  controlBrightness,
  controlBlur,
  controlSharpness,
  controlContrast,
  controlColor,
  brightnessValueText,
  blurValueText,
  sharpnessValueText,
  sharpnessSlider,
  contrastValueText,
  contrastSlider,
  colorValueText,
  colorSlider,
} from "./dom.js";
import { state } from "./state.js";

export function resetImageUI() {
  state.rotate.reset();

  resetSlider();

  modeFilterSelect.value = "original";
  modeAdjustmentSelect.value = "original";
  rotateSlider.value = rotateValueText.textContent = 0;
}

export function resetSlider() {
  brightnessValueText.textContent = brightnessSlider.value = 1.0;
  blurValueText.textContent = blurSlider.value = 0;
  sharpnessValueText.textContent = sharpnessSlider.value = 1.0;
  contrastValueText.textContent = contrastSlider.value = 1.0;
  colorValueText.textContent = colorSlider.value = 1.0;

  controlBrightness.style.display = "none";
  controlBlur.style.display = "none";
  controlSharpness.style.display = "none";
  controlContrast.style.display = "none";
  controlColor.style.display = "none";
}
