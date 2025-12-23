from PIL import Image, ImageEnhance
import cv2
import numpy as np
import io

def process_image(upload_file, mode, output_path, brightness, blur):
    image_bytes = upload_file.file.read()

    # Pillow
    pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    if mode == "gray":
        pil_img = pil_img.convert("L")

    elif mode == "bright":
        enhancer = ImageEnhance.Brightness(pil_img)
        pil_img = enhancer.enhance(brightness)

    elif mode == "blur":
        # OpenCV
        blur = blur if blur % 2 == 1 else blur + 1  # kernel phải là số lẻ
        open_cv_img = np.array(pil_img)
        open_cv_img = cv2.GaussianBlur(open_cv_img, (blur, blur), 0)
        pil_img = Image.fromarray(open_cv_img)
    elif mode == "original":
        pass 

    pil_img.save(output_path)
