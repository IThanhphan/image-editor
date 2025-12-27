from fastapi import APIRouter, UploadFile, File, Form, Request, HTTPException
from PIL import Image
import io, os, uuid

from services.image_builder import build_image

router = APIRouter()

ORIGINAL_DIR = "static/output"
os.makedirs(ORIGINAL_DIR, exist_ok=True)

def get_image_state(request: Request):
    return request.session.get("image")

@router.post("/upload")
async def upload(
    request: Request,
    image: UploadFile = File(...)
):
    request.session.pop("image", None)
    filename = f"{uuid.uuid4()}.png"
    original_path = os.path.join(ORIGINAL_DIR, filename)

    img_bytes = image.file.read()
    pil_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    pil_img.save(original_path)

    request.session["image"] = {
        "original_path": original_path,
        "filter": "original",
        "brightness": 1.0,
        "blur": 0,
        "sharpness": 1.0,
        "contrast": 1.0,
        "color": 1.0,
        "angle": 0,
        "flipX": 1,
        "flipY": 1,
        "remove_bg": False
    }

    output_path = build_image(request.session["image"])

    return {"url": "/" + output_path}

@router.post("/filter")
async def filter_image(
    request: Request,
    mode: str = Form("original")
):
    state = get_image_state(request)
    if not state:
        raise HTTPException(400, "No image session")

    state["filter"] = mode

    output_path = build_image(state)
    return {"url": "/" + output_path}

@router.post("/adjustment")
async def adjustment_image(
    request: Request,
    brightness: float = Form(1.0),
    blur: int = Form(0),
    sharpness: float = Form(1.0),
    contrast: float = Form(1.0),
    color: float = Form(1.0),
):
    state = get_image_state(request)
    if not state:
        raise HTTPException(400, "No image session")

    state["brightness"] = brightness
    state["blur"] = blur
    state["sharpness"] = sharpness
    state["contrast"] = contrast
    state["color"] = color

    output_path = build_image(state)
    return {"url": "/" + output_path}

@router.post("/rotate")
async def rotate_image(
    request: Request,
    angle: int = Form(0),
    flipX: int = Form(1),
    flipY: int = Form(1)
):
    state = get_image_state(request)
    if not state:
        raise HTTPException(400, "No image session")

    state["angle"] = angle
    state["flipX"] = flipX
    state["flipY"] = flipY

    output_path = build_image(state)
    return {"url": "/" + output_path}

@router.post("/remove-bg")
async def remove_bg(
    request: Request,
):
    state = get_image_state(request)
    if not state:
        raise HTTPException(400, "No image session")

    # Đánh dấu đã xóa nền
    state["remove_bg"] = True

    output_path = build_image(state)
    return {"url": "/" + output_path}
