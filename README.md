# FastVLM Browser Application

A real-time visual language model application that runs FastVLM-0.5B-ONNX directly in your browser using Hugging Face Transformers.js.

## Features

- **Real-time Video Analysis**: Analyze your webcam feed in real-time
- **AI-Powered Descriptions**: Get instant AI-generated descriptions of what the camera sees
- **Customizable Prompts**: Choose from different analysis prompts or create your own
- **Browser-Based**: Runs entirely in your browser - no server required
- **Privacy-First**: All processing happens locally, no data sent to external servers

## How It Works

1. **Camera Permission**: Grant camera access to start the application
2. **Model Loading**: The FastVLM-0.5B-ONNX model loads in your browser (may take a few minutes on first load)
3. **Real-time Analysis**: Point your camera at objects, scenes, or text to get instant AI analysis
4. **Interactive Controls**: Pause/resume analysis, change prompts, and view live captions

## Technology Stack

- **Frontend**: React 19 + Vite
- **AI Model**: FastVLM-0.5B-ONNX via Hugging Face Transformers.js
- **Styling**: Tailwind CSS
- **Video Processing**: WebRTC + Canvas API

## Getting Started

### Prerequisites

- Modern browser with WebRTC support (Chrome, Firefox, Safari, Edge)
- Camera/webcam
- Stable internet connection (for initial model download)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/o-messai/fastVLM.git
cd fastVLM
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Usage

1. **Start the Application**: Click "Allow Camera Access" when prompted
2. **Welcome Screen**: Read about the application and click "Start FastVLM"
3. **Model Loading**: Wait for the AI model to load (progress will be shown)
4. **Live Analysis**: Point your camera at objects to get real-time descriptions
5. **Customize**: Use the prompt selector to change analysis style
6. **Control**: Pause/resume analysis using the status bar controls

## Available Prompts

- **Default Description**: Standard image description
- **Simple Description**: Brief, concise analysis
- **Detailed Analysis**: Comprehensive description with context
- **What's Happening?**: Action and event-focused analysis

## Performance Notes

- **First Load**: Model download and initialization may take 2-5 minutes
- **Subsequent Loads**: Much faster as model is cached locally
- **Real-time Processing**: Analysis runs every second by default
- **Hardware Requirements**: Works best on devices with good CPU performance

## Browser Compatibility

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support (macOS 11+)
- **Edge**: Full support

## Troubleshooting

### Camera Issues
- Ensure camera permissions are granted
- Check if camera is being used by another application
- Try refreshing the page

### Model Loading Issues
- Check internet connection
- Clear browser cache and try again
- Ensure sufficient storage space (model is ~500MB)

### Performance Issues
- Close other browser tabs
- Reduce browser extensions
- Use a device with better CPU performance

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── CaptioningView.tsx
│   ├── LoadingScreen.tsx
│   ├── WelcomeScreen.tsx
│   └── WebcamPermissionDialog.tsx
├── context/            # React context
│   ├── VLMContext.tsx
│   └── useVLMContext.ts
├── types/              # Type definitions
│   └── index.ts
├── constants/          # Application constants
│   └── index.ts
├── App.jsx            # Main application component
└── main.jsx          # Application entry point
```

### Key Components

- **VLMContext**: Manages model loading and inference
- **CaptioningView**: Main interface for real-time analysis
- **LoadingScreen**: Shows model loading progress
- **WebcamPermissionDialog**: Handles camera access

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Hugging Face](https://huggingface.co/) for Transformers.js
- [FastVLM](https://github.com/Vision-CAIR/FastVLM) for the vision language model
- [ONNX Community](https://github.com/onnx/models) for the ONNX model

## Support

For issues and questions:
- Check the troubleshooting section above
- Open an issue on GitHub
- Review the browser console for error messages

---

**Note**: This application processes all data locally in your browser. No images, video, or personal data are sent to external servers.
