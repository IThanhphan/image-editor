import { imgView, bgInput, loadingBox } from "../core/dom.js";

import { startLoading, finishLoading } from "./loading.js";

export async function changeBgImage() {
  if (!imgView.src) return;

  const file = bgInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("bg_image", file);

  try {
    startLoading();
    loadingBox.classList.add("active");
    document.body.classList.add("loading");

    const res = await fetch("/api/change_bg", {
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
    loadingBox.classList.remove("active");
    document.body.classList.remove("loading");
  }
}
