import {
  imgView,
} from "../core/dom.js";

import { startLoading, finishLoading } from "./loading.js";

export async function removeBgImage() {
  if (!imgView.src) return;

  try {
    startLoading();

    const res = await fetch("/api/remove-bg", {
      method: "POST",
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
