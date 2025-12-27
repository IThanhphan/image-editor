import {
  modeSelect,
  brightnessSlider,
  blurSlider,
  imgView,
} from "../core/dom.js";

import { startLoading, finishLoading } from "./loading.js";

export async function filterImage() {
  if (!imgView.src) return;

  const formData = new FormData();
  formData.append("mode", modeSelect.value);
  formData.append("brightness", brightnessSlider.value);
  formData.append("blur", blurSlider.value);

  try {
    startLoading();

    const res = await fetch("/api/filter", {
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
