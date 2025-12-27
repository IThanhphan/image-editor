import {
  brightnessSlider,
  blurSlider,
  sharpnessSlider,
  contrastSlider,
  colorSlider,
  imgView,
} from "../core/dom.js";

import { startLoading, finishLoading } from "./loading.js";

export async function adjustmentImage() {
  if (!imgView.src) return;

  const formData = new FormData();
  formData.append("brightness", brightnessSlider.value);
  formData.append("blur", blurSlider.value);
  formData.append("sharpness", sharpnessSlider.value);
  formData.append("contrast", contrastSlider.value);
  formData.append("color", colorSlider.value);

  try {
    startLoading();

    const res = await fetch("/api/adjustment", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    const data = await res.json();
    imgView.src = data.url;
  } catch (err) {
    console.error("Filter error:", err);
  } finally {
    finishLoading();
  }
}
