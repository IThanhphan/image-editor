import {
  modeSelect,
  brightnessSlider,
  blurSlider,
  rotateSlider,
} from "./dom.js";
import { state } from "./state.js";

export function resetImageUI() {
  state.rotate.reset();

  modeSelect.value = "original";
  brightnessSlider.value = 1;
  blurSlider.value = 15;
  rotateSlider.value = 0;
}
