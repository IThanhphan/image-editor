import {
  fileInput,
  imgView,
} from "../core/dom.js";

export async function uploadImage() {
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  const data = await res.json();
  imgView.src = data.url;
}
