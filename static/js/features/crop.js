import { imgView } from "../core/dom.js";

import { startLoading, finishLoading } from "./loading.js";

import { resizeWidthInput, resizeHeightInput } from "../core/dom.js";

export async function cropImage(cropData) {
  if (!imgView.src) return;

  const scaleX = imgView.naturalWidth / imgView.clientWidth;
  const scaleY = imgView.naturalHeight / imgView.clientHeight;

  const realCrop = {
    x: Math.round(cropData.x * scaleX),
    y: Math.round(cropData.y * scaleY),
    w: Math.round(cropData.w * scaleX),
    h: Math.round(cropData.h * scaleY),
  };

  const formData = new FormData();
  formData.append("x", realCrop.x);
  formData.append("y", realCrop.y);
  formData.append("w", realCrop.w);
  formData.append("h", realCrop.h);

  try {
    startLoading();

    const res = await fetch("/api/crop", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    const data = await res.json();
    imgView.src = data.url;

    resizeWidthInput.value = imgView.width;
    resizeHeightInput.value = imgView.height;
  } catch (err) {
    console.error("Filter error:", err);
  } finally {
    finishLoading();
  }
}
