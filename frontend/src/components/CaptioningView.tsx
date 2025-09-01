import { useState, useRef, useEffect, useCallback } from "react";
import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Stack,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  Settings,
  Visibility,
  Error,
  CheckCircle,
} from "@mui/icons-material";
import { PROMPTS, TIMING } from "../constants";
import { useVLMContext } from "../context/useVLMContext";

interface CaptioningViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

function captureFrame(video: HTMLVideoElement): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx!.drawImage(video, 0, 0);
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob!), "image/jpeg", 0.95);
  });
}

function useCaptioningLoop(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  isRunning: boolean,
  promptRef: React.RefObject<string>,
  onCaptionUpdate: (caption: string) => void,
  onError: (error: string) => void,
  sendFrame: (imageBlob: Blob, prompt: string) => Promise<string>,
) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const onCaptionUpdateRef = useRef(onCaptionUpdate);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onCaptionUpdateRef.current = onCaptionUpdate;
  }, [onCaptionUpdate]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    abortControllerRef.current?.abort();
    if (!isRunning) return;

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    const video = videoRef.current;
    const captureLoop = async () => {
      while (!signal.aborted) {
        if (video && video.readyState >= 2 && !video.paused && video.videoWidth > 0) {
          try {
            const currentPrompt = promptRef.current || "";
            const blob = await captureFrame(video);
            const result = await sendFrame(blob, currentPrompt);
            if (result && !signal.aborted) onCaptionUpdateRef.current(result);
          } catch (error: unknown) {
            if (!signal.aborted) {
              const message = error instanceof Error ? error.message : String(error);
              onErrorRef.current(message);
              console.error("Error processing frame:", error);
            }
          }
        }
        if (signal.aborted) break;
        await new Promise((resolve) => setTimeout(resolve, TIMING.FRAME_CAPTURE_DELAY));
      }
    };

    setTimeout(captureLoop, 0);

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [isRunning, promptRef, videoRef, sendFrame]);
}

export default function CaptioningView({ videoRef }: CaptioningViewProps) {
  const { sendFrame, sendFrames, isConnected, error: contextError } = useVLMContext();
  const [caption, setCaption] = useState<string>("");
  const [isLoopRunning, setIsLoopRunning] = useState<boolean>(true);
  const [currentPrompt, setCurrentPrompt] = useState<string>("Describe what is happening.");
  const [error, setError] = useState<string | null>(null);
  const [numFrames, setNumFrames] = useState<number>(60);
  const [frameJump, setFrameJump] = useState<number>(10);
  const [isActionMode, setIsActionMode] = useState<boolean>(true);

  const promptRef = useRef<string>(currentPrompt);

  useEffect(() => {
    promptRef.current = currentPrompt;
  }, [currentPrompt]);

  useEffect(() => {
    if (contextError) {
      setError(contextError);
    }
  }, [contextError]);

  const handleCaptionUpdate = useCallback((newCaption: string) => {
    setCaption(newCaption);
    setError(null);
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setCaption(`Error: ${errorMessage}`);
  }, []);

  // Multi-frame capture and send logic
  useEffect(() => {
    let abort = false;
    if (!isLoopRunning) return;
    
    const video = videoRef.current;
    
    async function captureAndSendFrames() {
      if (!video || video.readyState < 2 || video.paused || video.videoWidth === 0) return;
      
      try {
        if (isActionMode && sendFrames) {
          // Action mode: capture multiple frames
          const blobs: Blob[] = [];
          let frameIdx = 0;
          
          while (blobs.length < numFrames && !abort) {
            const blob = await captureFrame(video);
            blobs.push(blob);
            frameIdx++;
            
            if (blobs.length < numFrames) {
              await new Promise(res => setTimeout(res, TIMING.FRAME_CAPTURE_DELAY * frameJump));
            }
          }
          
          const prompt = promptRef.current || "";
          const result = await sendFrames(blobs, prompt, numFrames, frameJump);
          if (!abort) handleCaptionUpdate(result);
        } else {
          // Caption mode: capture single frame
          const blob = await captureFrame(video);
          const prompt = promptRef.current || "";
          const result = await sendFrame(blob, prompt);
          if (!abort) handleCaptionUpdate(result);
        }
      } catch (error: unknown) {
        if (!abort) handleError(error instanceof Error ? error.message : String(error));
      }
    }

    // Start the continuous loop
    const startLoop = () => {
      if (abort) return;
      captureAndSendFrames().finally(() => {
        if (!abort) {
          setTimeout(startLoop, TIMING.FRAME_CAPTURE_DELAY * 2);
        }
      });
    };

    startLoop();
    
    return () => { 
      abort = true; 
    };
  }, [isLoopRunning, numFrames, frameJump, sendFrames, sendFrame, videoRef, handleCaptionUpdate, handleError, isActionMode]);

  const handlePromptChange = useCallback((prompt: string) => {
    setCurrentPrompt(prompt);
    setError(null);
  }, []);

  const handleToggleLoop = useCallback(() => {
    setIsLoopRunning((prev) => !prev);
    if (error) setError(null);
  }, [error]);

  const handleToggleMode = useCallback(() => {
    setIsActionMode((prev) => !prev);
    setError(null);
  }, []);

  const promptOptions = [
    { value: "Describe what you see in one sentence.", label: "Simple Description" },
    { value: "Provide a detailed analysis of this image.", label: "Detailed Analysis" },
    { value: "Describe what is happening.", label: "What's Happening?" },
    // etc.
  ];

  return (
    <Box sx={{ position: "absolute", inset: 0, color: "white" }}>
      <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
        {/* Status Bar - Top */}
        <Paper
          elevation={3}
          className="vintage-card"
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            right: 16,
            zIndex: 10,
            background: "rgba(14, 11, 11, 0.04)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.6)",
          }}
        >
          <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                icon={isLoopRunning ? <CheckCircle className="vintage-icon" /> : <Error className="vintage-icon" />}
                label={isLoopRunning ? "Live Analysis" : "Paused"}
                color={isLoopRunning ? "success" : "error"}
                variant="outlined"
                className="vintage-pulse"
              />
              <Chip
                icon={isConnected ? <CheckCircle className="vintage-icon" /> : <Error className="vintage-icon" />}
                label={isConnected ? "Connected" : "Disconnected"}
                color={isConnected ? "success" : "error"}
                variant="outlined"
                size="small"
                className="vintage-pulse"
                sx={{ animationDelay: "0.5s" }}
              />
              <Typography variant="body2" color="text.secondary" className="vintage-text">
                FastVLM is {isLoopRunning ? "actively analyzing" : "paused"}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={handleToggleMode}
                color="primary"
                className="vintage-button"
                sx={{
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "white",
                  "&:hover": {
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {isActionMode ? "Action Mode" : "Caption Mode"}
              </Button>
              <Button
                variant="contained"
                startIcon={isLoopRunning ? <Pause className="vintage-icon" /> : <PlayArrow className="vintage-icon" />}
                onClick={handleToggleLoop}
                color="primary"
                className="vintage-button"
                sx={{
                  background: "linear-gradient(45deg, #00d4aa 0%, #4dd8c7 100%)",
                  color: "#000",
                  fontWeight: 600,
                  "&:hover": {
                    background: "linear-gradient(45deg, #4dd8c7 0%, #00d4aa 100%)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 16px rgba(0, 212, 170, 0.3)",
                  },
                }}
              >
                {isLoopRunning ? "Pause" : "Resume"}
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* Prompt Input & Frame Controls - Bottom Left */}
        <Paper
          elevation={3}
          className="vintage-card"
          sx={{
            position: "absolute",
            bottom: 16,
            left: 16,
            zIndex: 10,
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.2)",
            minWidth: 300,
            p: 2,
          }}
        >
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <Select
                value={currentPrompt}
                onChange={(e) => handlePromptChange(e.target.value)}
                sx={{ color: "white" }}
                className="vintage-input"
              >
                {promptOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {isActionMode && (
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                  Frame Settings
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
                    Frames:
                  </Typography>
                  <input
                    type="number"
                    min={1}
                    max={32}
                    value={numFrames}
                    onChange={e => setNumFrames(Number(e.target.value))}
                    style={{
                      width: 60,
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "#fff",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      borderRadius: 4,
                      padding: "4px 8px",
                      fontSize: "0.875rem",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 50 }}>
                    Jump:
                  </Typography>
                  <input
                    type="number"
                    min={1}
                    max={16}
                    value={frameJump}
                    onChange={e => setFrameJump(Number(e.target.value))}
                    style={{
                      width: 60,
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "#fff",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      borderRadius: 4,
                      padding: "4px 8px",
                      fontSize: "0.875rem",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                </Stack>
              </Stack>
            )}
          </Stack>
        </Paper>

        {/* Live Caption/Action - Bottom Right */}
        <Paper
          elevation={3}
          className="vintage-card"
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: 10,
            background: "rgba(27, 23, 23, 0.14)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.2)",
            minWidth: 350,
            maxWidth: 500,
          }}
        >
          <Box sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Visibility color="primary" className="vintage-icon" />
                <Typography variant="subtitle2" fontWeight="medium" className="vintage-text">
                  {isActionMode ? "Action Prediction" : "Live Caption"}
                </Typography>
                <Chip
                  size="small"
                  label={isActionMode ? "Multi-Frame" : "Single Frame"}
                  color="primary"
                  variant="outlined"
                  className="vintage-pulse"
                />
              </Box>
              <Box sx={{ minHeight: 80 }}>
                {error ? (
                  <Alert 
                    severity="error" 
                    sx={{ mb: 2 }}
                    className="vintage-alert error"
                  >
                    {error}
                  </Alert>
                ) : caption ? (
                  <Box
                    sx={{
                      background: "rgba(20, 24, 28, 0.85)",
                      color: "#e0e0e0",
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      display: "inline-block",
                      maxWidth: "100%",
                      wordBreak: "break-word",
                      fontSize: "1.1em",
                      fontWeight: 500,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    {caption}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" className="vintage-text">
                    Waiting for analysis...
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>
        </Paper>

        {/* Error Display - Top Center */}
        {error && (
          <Alert
            severity="error"
            className="vintage-alert error"
            sx={{
              position: "absolute",
              top: 100,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              minWidth: 400,
              border: "1px solid rgba(244, 67, 54, 0.3)",
              backgroundColor: "rgba(244, 67, 54, 0.05)",
            }}
            action={
              <Tooltip title="Clear error">
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => setError(null)}
                >
                  <Error className="vintage-icon" />
                </IconButton>
              </Tooltip>
            }
          >
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  );
}
