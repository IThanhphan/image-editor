from PIL import Image, ImageEnhance, ImageFilter, ImageOps
import cv2
import numpy as np
import io, os, uuid

OUTPUT_DIR = "static/output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def build_image(state: dict):
    #Load ảnh
    img = Image.open(state["original_path"]).convert("RGBA")

    #Remove background (lazy import)
    if state.get("remove_bg"):
        import rembg
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        img = Image.open(io.BytesIO(rembg.remove(buf.getvalue()))).convert("RGBA")

    #Transform (giữ RGBA)
    if state["flipX"] == -1:
        img = img.transpose(Image.FLIP_LEFT_RIGHT)

    if state["flipY"] == -1:
        img = img.transpose(Image.FLIP_TOP_BOTTOM)

    if state["angle"] != 0:
        img = img.rotate(-state["angle"], expand=True)

    #Tách alpha
    rgb, alpha = img.convert("RGB"), img.split()[-1]

    if state["filter"] == "gray":
        rgb = rgb.convert("L").convert("RGB")

    elif state["filter"] == "invert":
        rgb = ImageOps.invert(rgb)

    elif state["filter"] == "edge":
        rgb = rgb.filter(ImageFilter.FIND_EDGES)

    elif state["filter"] == "sepia":
        gray = rgb.convert("L")
        rgb = Image.merge(
            "RGB",
            (
                gray.point(lambda x: min(255, x + 40)),
                gray.point(lambda x: min(255, x + 20)),
                gray
            )
        )
    
    elif state["filter"] == "emboss":
        kernel = np.array([[ -2, -1, 0],
                        [ -1,  1, 1],
                        [  0,  1, 2]])
        cv_img = cv2.filter2D(np.array(rgb), -1, kernel)
        rgb = Image.fromarray(cv_img)

    elif state["filter"] == "canny":
        cv_img = cv2.cvtColor(np.array(rgb), cv2.COLOR_RGB2GRAY)
        edges = cv2.Canny(cv_img, 100, 200)
        rgb = Image.fromarray(edges).convert("RGB")

    elif state["filter"] == "pixel":
        w, h = rgb.size
        # pixel = max(1, min(state["pixel"], min(w, h)//2))

        small = rgb.resize(
            (w // 8, h // 8),
            Image.NEAREST
        )
        rgb = small.resize((w, h), Image.NEAREST)


    if state["brightness"] != 1.0:
        enhancer = ImageEnhance.Brightness(rgb)
        rgb = enhancer.enhance(state["brightness"])

    if state["blur"] > 1.0:
        blur = state["blur"]
        blur = blur if blur % 2 == 1 else blur + 1
        cv_img = np.array(rgb)
        cv_img = cv2.GaussianBlur(cv_img, (blur, blur), 0)
        rgb = Image.fromarray(cv_img)

    if state["sharpness"] != 1.0:
        enhancer = ImageEnhance.Sharpness(rgb)
        rgb = enhancer.enhance(state["sharpness"])
    
    if state["contrast"] != 1.0:
        enhancer = ImageEnhance.Contrast(rgb)
        rgb = enhancer.enhance(state["contrast"])

    if state["color"] != 1.0:
        enhancer = ImageEnhance.Color(rgb)
        rgb = enhancer.enhance(state["color"])

    #Ghép lại RGBA
    img = Image.merge("RGBA", (*rgb.split(), alpha))

    #Save
    filename = f"{uuid.uuid4()}.png"
    output_path = os.path.join(OUTPUT_DIR, filename)
    img.save(output_path, format="PNG")

    return output_path
