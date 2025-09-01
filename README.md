# FastVLM + FastAPI + React js

![Demo Animation](/demo.gif)

FastVLM is a **real-time visual language model demo** built with:
- **FastAPI** as the backend (serving a Hugging Face Transformer model).
- **React.js** as the frontend (providing a live webcam UI).

The app streams your webcam feed to the model, which generates **real-time captions and analysis**.

---

## 🚀 Features
- Real-time webcam captioning with a Hugging Face Transformer model (ONNX).
- Backend API built with FastAPI and Uvicorn.
- Frontend UI built with React.js + Material UI.
- Simple start-up workflow: run backend + frontend locally.

---

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/o-messai/fastVLM.git
cd fastVLM
```
### 2. Backend Setup (FastAPI + Hugging Face)

Make sure you have Python 3.9+ installed.

Create and activate a virtual environment:
```
python -m venv venv
source venv/bin/activate   # Linux / macOS
venv\Scripts\activate      # Windows
```

Install dependencies:
```
pip install fastapi uvicorn[standard] transformers onnxruntime torch
```

⚡ torch may take time to install; if you want GPU support, install the CUDA-enabled version from PyTorch
.

Start the backend server:
```
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will run at:
```
http://localhost:8000
```

API docs available at:
```
http://localhost:8000/docs
```
### 3. Frontend Setup (React.js)

Make sure you have Node.js 18+ and npm (or yarn) installed.

Navigate to the frontend folder:
```
cd frontend
```

Install dependencies:
```
npm install
```

Start the frontend:
```
npm start
```

Frontend will run at:
```
http://localhost:3000
```
### 🖥️ Usage

Start the backend (uvicorn).

Start the frontend (npm start).

Open http://localhost:3000
.

### Allow camera permissions.

Interact with the welcome screen, then view real-time AI captions of your webcam feed.

### 📂 Project Structure
```
fastVLM/
├── backend/                 # FastAPI backend
│   ├── main.py          # Entry point for Uvicorn
│   └── ...              # API endpoints, model loading
├── frontend/            # React.js frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Context providers
│   │   └── App.tsx      # Main app logic
├── requirements.txt     # Optional Python dependency file
└── README.md            # This file
```
⚡ Tech Stack
```
Backend: FastAPI, Hugging Face Transformers, ONNX Runtime, Uvicorn

Frontend: React.js, Material UI, TailwindCSS

Languages: Python, TypeScript
```
📜 License

This project is licensed under the MIT License.