import {
  controlBrightness,
  controlBlur,
  controlSharpness,
  controlContrast,
  controlColor,
} from "../core/dom.js";

export function updateSlidersByMode(mode) {
  if (mode === "bright") controlBrightness.style.display = "block";
  if (mode === "blur") controlBlur.style.display = "block";
  if (mode === "sharpness") controlSharpness.style.display = "block";
  if (mode === "contrast") controlContrast.style.display = "block";
  if (mode === "color") controlColor.style.display = "block";
}
