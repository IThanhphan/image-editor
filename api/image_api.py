from fastapi import APIRouter, UploadFile, File, Form
from PIL import Image, ImageEnhance
from fastapi.responses import FileResponse
from services.image_service import processFilterImage, processRotateImage
import uuid, os, io

router = APIRouter()

OUTPUT_DIR = "static/output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

@router.post("/upload")
async def upload(
    image: UploadFile = File(...)
):
    filename = f"{uuid.uuid4()}.png"
    output_path = os.path.join(OUTPUT_DIR, filename)

    image_bytes = image.file.read()

    pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    pil_img.save(output_path)

    return {
        "url": f"/static/output/{filename}"
    }

@router.post("/filter")
async def filterImage(
    image: UploadFile = File(...),
    mode: str = Form("gray"),
    brightness: float = Form(1.0),
    blur: int = Form(15)
):
    filename = f"{uuid.uuid4()}.png"
    output_path = os.path.join(OUTPUT_DIR, filename)

    processFilterImage(image, mode, output_path, brightness, blur)

    return {
        "url": f"/static/output/{filename}"
    }

@router.post("/rotate")
async def rotateImage(
    image: UploadFile = File(...),
    angle: float = Form(0),
    flipX: int = Form(1),
    flipY: int = Form(1)
):
    filename = f"{uuid.uuid4()}.png"
    output_path = os.path.join(OUTPUT_DIR, filename)

    processRotateImage(image, output_path, angle, flipX, flipY)

    return {
        "url": f"/static/output/{filename}"
    }

