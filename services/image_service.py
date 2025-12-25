from PIL import Image, ImageEnhance
import cv2
import numpy as np
import io

def processFilterImage(upload_file, mode, output_path, brightness, blur):
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

def processRotateImage(upload_file, output_path, angle=0, flipX=1, flipY=1):
    image_bytes = upload_file.file.read()

    # Pillow
    pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    # Flip X
    if flipX == -1:
        pil_img = pil_img.transpose(Image.FLIP_LEFT_RIGHT)

    # Flip Y
    if flipY == -1:
        pil_img = pil_img.transpose(Image.FLIP_TOP_BOTTOM)

    # Rotate
    if angle != 0:
        pil_img = pil_img.rotate(-angle, expand=True)

    pil_img.save(output_path)