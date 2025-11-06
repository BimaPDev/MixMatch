# server/python/remover/app.py
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response, PlainTextResponse
from rembg import remove, new_session
from PIL import Image, ImageOps
import io

# One-time model load. Options: "isnet-general-use", "u2net", "isnet-anime"
SESSION = new_session("isnet-general-use")

app = FastAPI()

@app.get("/", response_class=PlainTextResponse)
def health():
    return "ok"

@app.post("/remove_bg")
async def remove_bg(image: UploadFile = File(...)):
    data = await image.read()

    # Optional: downscale huge images to speed up
    im = Image.open(io.BytesIO(data)).convert("RGBA")
    im = ImageOps.exif_transpose(im)
    if max(im.size) > 3000:
        im.thumbnail((3000, 3000))

    # Remove background -> PNG bytes with alpha
    out_bytes = remove(
        np_bytes := _to_bytes(im),
        session=SESSION,
        alpha_matting=False,  # set True if edges need refinement
    )

    # Safety fallback if remover fails
    if not out_bytes or len(out_bytes) == 0:
        out = io.BytesIO()
        im.save(out, "PNG")
        out_bytes = out.getvalue()

    return Response(out_bytes, media_type="image/png")

def _to_bytes(im: Image.Image) -> bytes:
    b = io.BytesIO()
    im.save(b, "PNG")
    return b.getvalue()
