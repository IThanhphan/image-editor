import { brightnessSlider, blurSlider } from "../core/dom.js";

export function updateSlidersByMode(mode) {
  brightnessSlider.disabled = mode !== "bright";
  blurSlider.disabled = mode !== "blur";
}
