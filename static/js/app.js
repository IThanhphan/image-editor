const fileInput = document.querySelector(".image-input");
const imgView = document.querySelector(".preview");
const boxPreview = document.querySelector(".upload-box");
const uploadContent = document.querySelector(".upload-content");
const modeSelect = document.querySelector(".mode");
const brightnessSlider = document.querySelector(".brightness");
const blurSlider = document.querySelector(".blur");
const brightnessValue = document.querySelector(".brightness-value");
const blurValue = document.querySelector(".blur-value");
const downloadBtn = document.querySelector(".download-img");
const formatSelect = document.querySelector(".download-format");
const resizeWidthInput = document.querySelector(".resize-width");
const resizeHeightInput = document.querySelector(".resize-height");
const keepRatioCheckbox = document.querySelector(".keep-ratio");

let originalWidth = 0;
let originalHeight = 0;

downloadBtn.addEventListener("click", () => {
  if (!imgView.src) {
    alert("Chưa có ảnh để tải!");
    return;
  }

  const format = formatSelect.value;
  const mode = modeSelect.value;

  const targetW = parseInt(resizeWidthInput.value);
  const targetH = parseInt(resizeHeightInput.value);
  const keepRatio = keepRatioCheckbox.checked;

  const img = new Image();
  img.crossOrigin = "anonymous";

  img.onload = () => {
    let width = img.width;
    let height = img.height;

    // Resize logic
    if (targetW || targetH) {
      if (keepRatio) {
        const ratio = img.width / img.height;
        if (targetW) {
          width = targetW;
          height = Math.round(targetW / ratio);
        } else if (targetH) {
          height = targetH;
          width = Math.round(targetH * ratio);
        }
      } else {
        width = targetW || width;
        height = targetH || height;
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    // JPG nền trắng
    if (format === "jpg") {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(img, 0, 0, width, height);

    const mime = `image/${format === "jpg" ? "jpeg" : format}`;

    canvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob);
        triggerDownload(url, `image_${mode}_${width}x${height}.${format}`);
        URL.revokeObjectURL(url);
      },
      mime,
      0.95
    );
  };

  img.src = imgView.src;
});

function triggerDownload(src, filename) {
  const link = document.createElement("a");
  link.href = src;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

resizeWidthInput.addEventListener("input", () => {
  if (!keepRatioCheckbox.checked || !imgView.src) return;

  const img = new Image();
  img.onload = () => {
    resizeHeightInput.value = Math.round(
      (resizeWidthInput.value * img.height) / img.width
    );
  };
  img.src = imgView.src;
});

resizeHeightInput.addEventListener("input", () => {
  if (!keepRatioCheckbox.checked || !imgView.src) return;

  const img = new Image();
  img.onload = () => {
    resizeWidthInput.value = Math.round(
      (resizeHeightInput.value * img.height) / img.width
    );
  };
  img.src = imgView.src;
});

function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const debouncedUpload = debounce(() => {
  if (fileInput.files.length > 0) {
    upload();
  }
}, 400);

updateSlidersByMode(modeSelect.value);

modeSelect.addEventListener("change", () => {
  updateSlidersByMode(modeSelect.value);

  if (fileInput.files.length > 0) {
    upload();
  }
});

brightnessSlider.addEventListener("input", debouncedUpload);

blurSlider.addEventListener("input", debouncedUpload);

boxPreview.addEventListener("click", () => {
  fileInput.click();
});

boxPreview.addEventListener("dragover", (e) => {
  e.preventDefault();
  boxPreview.classList.add("dragover");
});

boxPreview.addEventListener("dragleave", () => {
  boxPreview.classList.remove("dragover");
});

boxPreview.addEventListener("drop", (e) => {
  e.preventDefault();
  boxPreview.classList.remove("dragover");

  const file = e.dataTransfer.files[0];
  if (!file) return;

  fileInput.files = e.dataTransfer.files;
  previewImage(file);
  upload();
});

fileInput.addEventListener("change", () => {
  modeSelect.value = "original";
  updateSlidersByMode("original");
  const file = fileInput.files[0];
  previewImage(file);
  upload();
});

function updateSlidersByMode(mode) {
  if (mode === "bright") {
    brightnessSlider.disabled = false;
    blurSlider.disabled = true;
  } else if (mode === "blur") {
    brightnessSlider.disabled = true;
    blurSlider.disabled = false;
  } else {
    brightnessSlider.disabled = true;
    blurSlider.disabled = true;
  }
}

function previewImage(file) {
  if (!file || !file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    imgView.src = e.target.result;
    imgView.style.display = "block";
    uploadContent.style.display = "none";

    // Lấy width & height gốc
    const img = new Image();
    img.onload = () => {
      originalWidth = img.width;
      originalHeight = img.height;

      resizeWidthInput.value = originalWidth;
      resizeHeightInput.value = originalHeight;
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

async function upload() {
  const file = fileInput.files[0];
  const mode = modeSelect.value;
  const brightness = parseFloat(brightnessSlider.value);
  const blur = parseInt(blurSlider.value);

  if (!file) {
    alert("Vui lòng chọn ảnh");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("brightness", brightness);
  formData.append("blur", blur);
  formData.append("mode", mode);

  try {
    const res = await fetch(`/api/edit`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    imgView.src = data.url;
  } catch (err) {
    console.error(err);
    alert("Lỗi khi upload ảnh");
  }
}
