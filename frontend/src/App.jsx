import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoadingScreen from "./components/LoadingScreen";
import CaptioningView from "./components/CaptioningView";
import WelcomeScreen from "./components/WelcomeScreen";
import WebcamPermissionDialog from "./components/WebcamPermissionDialog";
import { VLMProvider } from "./context/VLMContext";
import { theme } from "./theme";
import "./App.css";

function AppContent() {
  const [appState, setAppState] = useState("requesting-permission");
  const [webcamStream, setWebcamStream] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef(null);

  const handlePermissionGranted = useCallback((stream) => {
    setWebcamStream(stream);
    setAppState("welcome");
  }, []);

  const handleStart = useCallback(() => {
    setAppState("loading");
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setAppState("captioning");
  }, []);

  const playVideo = useCallback(async (video) => {
    try {
      await video.play();
    } catch (error) {
      console.error("Failed to play video:", error);
    }
  }, []);

  const setupVideo = useCallback(
    (video, stream) => {
      video.srcObject = stream;

      const handleCanPlay = () => {
        setIsVideoReady(true);
        playVideo(video);
      };

      video.addEventListener("canplay", handleCanPlay, { once: true });

      return () => {
        video.removeEventListener("canplay", handleCanPlay);
      };
    },
    [playVideo],
  );

  useEffect(() => {
    if (webcamStream && videoRef.current) {
      const video = videoRef.current;

      video.srcObject = null;
      video.load();

      const cleanup = setupVideo(video, webcamStream);
      return cleanup;
    }
  }, [webcamStream, setupVideo]);

  const videoBlurState = useMemo(() => {
    switch (appState) {
      case "requesting-permission":
        return "blur(20px) brightness(0.2) saturate(0.5)";
      case "welcome":
        return "blur(12px) brightness(0.3) saturate(0.7)";
      case "loading":
        return "blur(8px) brightness(0.4) saturate(0.8)";
      case "captioning":
        return "none";
      default:
        return "blur(20px) brightness(0.2) saturate(0.5)";
    }
  }, [appState]);

  return (
    <div className="App relative h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gray-900" />

      {webcamStream && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out"
          style={{
            filter: videoBlurState,
            opacity: isVideoReady ? 1 : 0,
          }}
        />
      )}

      {appState !== "captioning" && <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" />}

      {appState === "requesting-permission" && <WebcamPermissionDialog onPermissionGranted={handlePermissionGranted} />}

      {appState === "welcome" && <WelcomeScreen onStart={handleStart} />}

      {appState === "loading" && <LoadingScreen onComplete={handleLoadingComplete} />}

      {appState === "captioning" && <CaptioningView videoRef={videoRef} />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <VLMProvider>
        <AppContent />
      </VLMProvider>
    </ThemeProvider>
  );
}

export default App;
