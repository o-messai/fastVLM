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

interface CaptioningViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

async function sendFrameToBackend(imageBlob: Blob, prompt: string) {
  const formData = new FormData();
  formData.append("file", imageBlob, "frame.jpg");
  // Optionally send prompt as a query param or in formData
  const response = await fetch("http://localhost:8000/caption", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  return data.caption;
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
            const result = await sendFrameToBackend(blob, currentPrompt);
            if (result && !signal.aborted) onCaptionUpdateRef.current(result);
          } catch (error: any) {
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
  }, [isRunning, promptRef, videoRef]);
}

export default function CaptioningView({ videoRef }: CaptioningViewProps) {
  const [caption, setCaption] = useState<string>("");
  const [isLoopRunning, setIsLoopRunning] = useState<boolean>(true);
  const [currentPrompt, setCurrentPrompt] = useState<string>(PROMPTS.default);
  const [error, setError] = useState<string | null>(null);

  const promptRef = useRef<string>(currentPrompt);

  useEffect(() => {
    promptRef.current = currentPrompt;
  }, [currentPrompt]);

  const handleCaptionUpdate = useCallback((newCaption: string) => {
    setCaption(newCaption);
    setError(null);
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setCaption(`Error: ${errorMessage}`);
  }, []);

  useCaptioningLoop(videoRef, isLoopRunning, promptRef, handleCaptionUpdate, handleError);

  const handlePromptChange = useCallback((prompt: string) => {
    setCurrentPrompt(prompt);
    setError(null);
  }, []);

  const handleToggleLoop = useCallback(() => {
    setIsLoopRunning((prev) => !prev);
    if (error) setError(null);
  }, [error]);

  const promptOptions = [
    { value: PROMPTS.default, label: "Default Description" },
    { value: PROMPTS.simple, label: "Simple Description" },
    { value: PROMPTS.detailed, label: "Detailed Analysis" },
    { value: PROMPTS.question, label: "What's Happening?" },
  ];

  return (
    <Box sx={{ position: "absolute", inset: 0, color: "white" }}>
      <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
        {/* Status Bar - Top */}
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            right: 16,
            zIndex: 10,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                icon={isLoopRunning ? <CheckCircle /> : <Error />}
                label={isLoopRunning ? "Live Analysis" : "Paused"}
                color={isLoopRunning ? "success" : "error"}
                variant="outlined"
              />
              <Typography variant="body2" color="text.secondary">
                FastVLM is {isLoopRunning ? "actively analyzing" : "paused"}
              </Typography>
            </Stack>
            <Button
              variant={isLoopRunning ? "outlined" : "contained"}
              startIcon={isLoopRunning ? <Pause /> : <PlayArrow />}
              onClick={handleToggleLoop}
              color={isLoopRunning ? "warning" : "success"}
            >
              {isLoopRunning ? "Pause" : "Resume"}
            </Button>
          </Box>
        </Paper>

        {/* Prompt Input - Bottom Left */}
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            bottom: 16,
            left: 16,
            zIndex: 10,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(10px)",
            minWidth: 300,
          }}
        >
          <Box sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Settings color="primary" />
                <Typography variant="subtitle2" fontWeight="medium">
                  Analysis Prompt
                </Typography>
              </Box>
              <FormControl fullWidth size="small">
                <Select
                  value={currentPrompt}
                  onChange={(e) => handlePromptChange(e.target.value)}
                  sx={{ color: "white" }}
                >
                  {promptOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Box>
        </Paper>

        {/* Live Caption - Bottom Right */}
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: 10,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(10px)",
            minWidth: 350,
            maxWidth: 500,
          }}
        >
          <Box sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Visibility color="primary" />
                <Typography variant="subtitle2" fontWeight="medium">
                  Live Caption
                </Typography>
                <Chip
                  size="small"
                  label="AI Analysis"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <Box sx={{ minHeight: 80 }}>
                {error ? (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                ) : caption ? (
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {caption}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
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
            sx={{
              position: "absolute",
              top: 100,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              minWidth: 400,
            }}
            action={
              <Tooltip title="Clear error">
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => setError(null)}
                >
                  <Error />
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
