import { imgView } from "../core/dom.js";
import { startLoading, finishLoading } from "./loading.js";

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

  reset() {
    this.state.angle = 0;
    this.state.flipX = 1;
    this.state.flipY = 1;
  }
}

export async function rotateImage(rotate) {
  if (!imgView.src) return;
  const formData = new FormData();
  formData.append("angle", rotate.state.angle);
  formData.append("flipX", rotate.state.flipX);
  formData.append("flipY", rotate.state.flipY);

  try {
    startLoading();

    const res = await fetch("/api/rotate", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Rotate failed");
    }

    const data = await res.json();
    imgView.src = data.url;
  } catch (err) {
    console.error("Rotate error:", err);
  } finally {
    finishLoading();
  }
}
