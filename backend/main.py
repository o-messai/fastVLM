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

class ActionRequest(BaseModel):
    num_frames: int
    frame_jump: int

class ActionResponse(BaseModel):
    action: str

MID = "apple/FastVLM-0.5B"
IMAGE_TOKEN_INDEX = -200

def load_model():
    print(f"Loading {MID} model and tokenizer...")
    tok = AutoTokenizer.from_pretrained(MID, trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(
        MID,
        dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
        trust_remote_code=True,
    )
    
    # Move model to appropriate device
    if torch.cuda.is_available():
        model = model.cuda()
        print("Model moved to CUDA")
    else:
        print("Model running on CPU")
    
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
    
    # Move tensors to the same device as the model
    device = next(model.parameters()).device
    input_ids = torch.cat([pre_ids, img_tok, post_ids], dim=1).to(device)
    attention_mask = torch.ones_like(input_ids, device=device)
    
    # Preprocess image
    px = model.get_vision_tower().image_processor(images=image, return_tensors="pt")["pixel_values"]
    px = px.to(device, dtype=model.dtype)
    
    # Generate
    with torch.no_grad():
        out = model.generate(
            inputs=input_ids,
            attention_mask=attention_mask,
            images=px,
            max_new_tokens=64,
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

@app.post("/action", response_model=ActionResponse)
async def predict_action(
    files: list[UploadFile] = File(...),
    num_frames: int = Form(...),
    frame_jump: int = Form(...),
    prompt: str = Form("Describe what you see in this image.")
):
    images = []
    for file in files:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        images.append(image)
    
    if len(images) > 1:
        # Concatenate images horizontally to create a sequence view
        # This allows FastVLM to see all frames at once and analyze the action
        total_width = sum(img.width for img in images)
        max_height = max(img.height for img in images)
        
        # Create a new image with all frames side by side
        combined_image = Image.new('RGB', (total_width, max_height))
        
        x_offset = 0
        from PIL import ImageDraw, ImageFont

        for img in images:
            # Resize image to match max height while maintaining aspect ratio
            aspect_ratio = img.width / img.height
            new_width = int(max_height * aspect_ratio)
            resized_img = img.resize((new_width, max_height), Image.Resampling.LANCZOS)

            # Draw frame number on the resized image (top-left corner, red, big font)
            draw = ImageDraw.Draw(resized_img)
            try:
                # Try to use a truetype font for bigger size
                font = ImageFont.truetype("arial.ttf", size=int(max_height * 0.15))
            except Exception:
                # Fallback to default font if truetype not available
                font = ImageFont.load_default()
            frame_number = images.index(img) + 1  # 1-based index
            text = f"{frame_number}"
            # Calculate position (a little padding from top-left)
            x_text, y_text = 10, 10
            # Draw text with red color and big font
            draw.text((x_text, y_text), text, font=font, fill=(255, 0, 0))

            combined_image.paste(resized_img, (x_offset, 0))
            x_offset += new_width
        
        # Create a prompt that asks for action analysis across the sequence
        action_prompt = (
            f"You are given {len(images)} consecutive video frames. "
            "Respond with a single concise statement about the sequence as a whole. "
            "Avoid ambiguous answers. "
            f"{prompt}"
        )
        # Generate single action caption from the combined image
        action = run_fastvlm_caption(combined_image, action_prompt)
    else:
        # Single frame case
        action_prompt = f"Describe what you see in this image. {prompt}"
        action = run_fastvlm_caption(images[0], action_prompt)
    
    return {"action": action}
