import { loadingBar } from "../core/dom.js";

export function startLoading() {
  loadingBar.style.opacity = "1";
  loadingBar.style.width = "30%";

  setTimeout(() => {
    loadingBar.style.width = "60%";
  }, 200);
}

export function finishLoading() {
  loadingBar.style.width = "100%";

  setTimeout(() => {
    loadingBar.style.opacity = "0";
    loadingBar.style.width = "0%";
  }, 300);
}
