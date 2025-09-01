from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import io
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CaptionResponse(BaseModel):
    caption: str

MID = "apple/FastVLM-0.5B"
IMAGE_TOKEN_INDEX = -200

def load_model():
    print("Loading FastVLM-0.5B model and tokenizer...")
    tok = AutoTokenizer.from_pretrained(MID, trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(
        MID,
        dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
        device_map="auto",
        trust_remote_code=True,
    )
    print("Loaded.")
    return tok, model

tok, model = load_model()

def run_fastvlm_caption(image: Image.Image, prompt: str) -> str:
    # Build chat prompt
    messages = [
        {"role": "user", "content": f"<image>\n{prompt}"}
    ]
    rendered = tok.apply_chat_template(
        messages, add_generation_prompt=True, tokenize=False
    )
    pre, post = rendered.split("<image>", 1)
    pre_ids  = tok(pre,  return_tensors="pt", add_special_tokens=False).input_ids
    post_ids = tok(post, return_tensors="pt", add_special_tokens=False).input_ids
    img_tok = torch.tensor([[IMAGE_TOKEN_INDEX]], dtype=pre_ids.dtype)
    input_ids = torch.cat([pre_ids, img_tok, post_ids], dim=1).to(model.device)
    attention_mask = torch.ones_like(input_ids, device=model.device)
    # Preprocess image
    px = model.get_vision_tower().image_processor(images=image, return_tensors="pt")["pixel_values"]
    px = px.to(model.device, dtype=model.dtype)
    # Generate
    with torch.no_grad():
        out = model.generate(
            inputs=input_ids,
            attention_mask=attention_mask,
            images=px,
            max_new_tokens=32,
        )
    caption = tok.decode(out[0], skip_special_tokens=True)
    return caption.strip()

@app.post("/caption", response_model=CaptionResponse)
async def caption_image(
    file: UploadFile = File(...),
    prompt: str = Form("Describe in one sentence")
):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    caption = run_fastvlm_caption(image, prompt)
    return {"caption": caption}
