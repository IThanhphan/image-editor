import { imgView } from "../core/dom.js";

export class RotateFeature {
  constructor() {
    this.state = {
      angle: 0,
      flipX: 1,
      flipY: 1,
    };
  }

  normalizeAngle(angle) {
    return ((((angle + 180) % 360) + 360) % 360) - 180;
  }

  rotateLeft() {
    this.state.angle = this.normalizeAngle(this.state.angle - 90);
  }

  rotateRight() {
    this.state.angle = this.normalizeAngle(this.state.angle + 90);
  }

  flipX() {
    this.state.flipX *= -1;
  }

  flipY() {
    this.state.flipY *= -1;
  }

  setRotate(value) {
    this.state.angle = this.normalizeAngle(value);
  }
}

export async function rotateImage(file, rotate) {
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);
  formData.append("angle", rotate.state.angle);
  formData.append("flipX", rotate.state.flipX);
  formData.append("flipY", rotate.state.flipY);

  const res = await fetch("/api/rotate", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  const data = await res.json();
  imgView.src = data.url;
}
