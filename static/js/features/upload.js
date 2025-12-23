import { fileInput, modeSelect, brightnessSlider, blurSlider, imgView } from "../core/dom.js";

export async function uploadImage() {
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);
  formData.append("mode", modeSelect.value);
  formData.append("brightness", brightnessSlider.value);
  formData.append("blur", blurSlider.value);

  const res = await fetch("/api/edit", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  const data = await res.json();
  imgView.src = data.url;
}
