from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
from services.image_service import process_image
import uuid, os

router = APIRouter()

OUTPUT_DIR = "static/output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

@router.post("/edit")
async def edit_image(
    image: UploadFile = File(...),
    mode: str = Form("gray"),
    brightness: float = Form(1.0),
    blur: int = Form(15)
):
    filename = f"{uuid.uuid4()}.png"
    output_path = os.path.join(OUTPUT_DIR, filename)

    process_image(image, mode, output_path, brightness, blur)

    return {
        "url": f"http://127.0.0.1:8000/static/output/{filename}"
    }
