import os
import hmac
import tempfile
import threading
from pathlib import Path
from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from starlette.background import BackgroundTask

MODEL_ID = os.getenv("CSM_MODEL_ID", "sesame/csm-1b")
VOICE_API_KEY = os.getenv("VOICE_API_KEY", "")
ALLOWED_ORIGINS = [x.strip() for x in os.getenv("VOICE_ALLOWED_ORIGINS", "*").split(",") if x.strip()]
MAX_TEXT_CHARS = int(os.getenv("MAX_TEXT_CHARS", "400"))

app = FastAPI(title="TOEIC Sesame CSM-1B Voice API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if ALLOWED_ORIGINS != ["*"] else ["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "X-Voice-Key"],
)

processor = None
model = None
device = "cuda"
model_lock = threading.Lock()

class SpeechRequest(BaseModel):
    text: str = Field(min_length=1, max_length=400)
    speed: float = Field(default=1.0, ge=0.3, le=1.25)

@app.on_event("startup")
def load_model():
    global processor, model
    import torch
    from transformers import AutoProcessor, CsmForConditionalGeneration
    if not torch.cuda.is_available():
        raise RuntimeError("CSM-1B requires a CUDA-compatible GPU.")
    processor = AutoProcessor.from_pretrained(MODEL_ID, token=os.getenv("HF_TOKEN"))
    model = CsmForConditionalGeneration.from_pretrained(
        MODEL_ID,
        device_map="cuda",
        torch_dtype=torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16,
        token=os.getenv("HF_TOKEN"),
    )
    model.eval()

def check_key(value: str | None):
    if not VOICE_API_KEY:
        raise HTTPException(status_code=503, detail="Voice API chưa được cấu hình VOICE_API_KEY.")
    if not value or not hmac.compare_digest(value, VOICE_API_KEY):
        raise HTTPException(status_code=401, detail="Mã truy cập giọng đọc không đúng.")

@app.get("/health")
def health():
    return {"ok": True, "model_loaded": model is not None, "model": MODEL_ID}

@app.post("/v1/speech")
def speech(body: SpeechRequest, request: Request, x_voice_key: str | None = Header(default=None)):
    check_key(x_voice_key)
    text = " ".join(body.text.split())
    if not text:
        raise HTTPException(status_code=422, detail="Vui lòng nhập nội dung tiếng Anh.")
    if len(text) > MAX_TEXT_CHARS:
        raise HTTPException(status_code=413, detail=f"Mỗi lượt tối đa {MAX_TEXT_CHARS} ký tự.")
    if model is None or processor is None:
        raise HTTPException(status_code=503, detail="Mô hình đang khởi động, vui lòng thử lại sau.")
    import torch
    # A single model instance serves one generation at a time to avoid GPU OOM.
    with model_lock, torch.inference_mode():
        inputs = processor(text=f"[0]{text}", add_special_tokens=True).to("cuda")
        audio = model.generate(**inputs, output_audio=True)
        tmp = tempfile.NamedTemporaryFile(prefix="toeic-csm-", suffix=".wav", delete=False)
        tmp_path = tmp.name
        tmp.close()
        processor.save_audio(audio, tmp_path)
    return FileResponse(
        tmp_path,
        media_type="audio/wav",
        filename="toeic-pronunciation.wav",
        background=BackgroundTask(lambda: Path(tmp_path).unlink(missing_ok=True)),
        headers={"Cache-Control": "no-store"},
    )
