from PIL import Image, ImageEnhance, ImageFilter
import cv2
import numpy as np
import io, os, uuid

OUTPUT_DIR = "static/output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def build_image(state: dict):
    # 1️⃣ Load ảnh
    img = Image.open(state["original_path"]).convert("RGBA")

    # 2️⃣ Remove background (lazy import)
    if state.get("remove_bg"):
        import rembg
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        img = Image.open(io.BytesIO(rembg.remove(buf.getvalue()))).convert("RGBA")

    # 3️⃣ Transform (giữ RGBA)
    if state["flipX"] == -1:
        img = img.transpose(Image.FLIP_LEFT_RIGHT)

    if state["flipY"] == -1:
        img = img.transpose(Image.FLIP_TOP_BOTTOM)

    if state["angle"] != 0:
        img = img.rotate(-state["angle"], expand=True)

    # 4️⃣ Tách alpha
    rgb, alpha = img.convert("RGB"), img.split()[-1]

    # 5️⃣ Filter (chỉ tác động RGB)
    if state["mode"] == "gray":
        rgb = rgb.convert("L").convert("RGB")

    elif state["mode"] == "bright":
        enhancer = ImageEnhance.Brightness(rgb)
        rgb = enhancer.enhance(state["brightness"])

    elif state["mode"] == "blur":
        blur = state["blur"]
        blur = blur if blur % 2 == 1 else blur + 1
        cv_img = np.array(rgb)
        cv_img = cv2.GaussianBlur(cv_img, (blur, blur), 0)
        rgb = Image.fromarray(cv_img)

    # 6️⃣ Ghép lại RGBA
    img = Image.merge("RGBA", (*rgb.split(), alpha))

    # 7️⃣ Save
    filename = f"{uuid.uuid4()}.png"
    output_path = os.path.join(OUTPUT_DIR, filename)
    img.save(output_path, format="PNG")

    return output_path
