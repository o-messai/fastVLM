# FastVLM Browser Application

A real-time visual language model frontend built with **React.js**.  
This app connects to the **FastAPI backend**, which runs the **FastVLM-0.5B-ONNX** model using Hugging Face and ONNX Runtime.  

---

## ✨ Features

- **Real-time Video Analysis**: Analyze your webcam feed in real time  
- **AI-Powered Descriptions**: Get instant AI-generated captions from the backend  
- **Customizable Prompts**: Choose from different analysis prompts or create your own  
- **Seamless UI**: Welcome screen, loading screen, and live captioning view  
- **Privacy-Friendly**: Webcam feed stays local in your browser, only frames are processed by your backend  

---

## ⚙️ How It Works

1. **Camera Permission**: Grant camera access to start the application  
2. **Backend Connection**: The app connects to the FastAPI backend for model inference  
3. **Real-time Analysis**: Webcam frames are sent to the backend, captions are returned instantly  
4. **Interactive Controls**: Pause/resume analysis, change prompts, and view live captions  

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite + Material UI + Tailwind CSS  
- **Backend**: FastAPI + Hugging Face Transformers + ONNX Runtime (runs separately)  
- **Video Handling**: WebRTC + Canvas API  

---

## 🚀 Getting Started (Frontend)

### Prerequisites

- Node.js **18+**  
- A running backend (see the [root README](../README.md) for backend setup)  
- Modern browser with WebRTC support (Chrome, Firefox, Safari, Edge)  

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/o-messai/fastVLM.git
   cd fastVLM/frontend
