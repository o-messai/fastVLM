import { useState } from "react";
import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Avatar,
} from "@mui/material";
import { CameraAlt, Security } from "@mui/icons-material";

interface WebcamPermissionDialogProps {
  onPermissionGranted: (stream: MediaStream) => void;
}

export default function WebcamPermissionDialog({ onPermissionGranted }: WebcamPermissionDialogProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async () => {
    setIsRequesting(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });
      onPermissionGranted(stream);
    } catch (err) {
      console.error("Failed to get camera permission:", err);
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError("Camera access was denied. Please allow camera access and refresh the page.");
        } else if (err.name === "NotFoundError") {
          setError("No camera found. Please connect a camera and refresh the page.");
        } else {
          setError(`Camera error: ${err.message}`);
        }
      } else {
        setError("Failed to access camera. Please check your camera permissions.");
      }
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        pointerEvents: "auto"
      }}
    >
      <Card 
        className="vintage-card vintage-border"
        sx={{ 
          maxWidth: 500, 
          width: "90%",
          maxHeight: "80vh",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
        }}
      >
        <CardContent sx={{ p: 4, textAlign: "center", position: "relative", zIndex: 1 }}>
          <Stack spacing={3} alignItems="center">
   
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              className="retro-glow vintage-text"
            >
              Camera Access Required
            </Typography>

            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 2 }}
              className="vintage-text"
            >
              FastVLM needs access to your camera to analyze images in real-time.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={requestPermission}
              disabled={isRequesting}
              startIcon={isRequesting ? <CircularProgress size={20} /> : <Security className="vintage-icon" />}
              className="vintage-button"
              sx={{ 
                minWidth: 200,
                background: "linear-gradient(45deg, #00d4aa 0%, #4dd8c7 100%)",
                color: "#000",
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(45deg, #4dd8c7 0%, #00d4aa 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(0, 212, 170, 0.4)",
                },
                "&:disabled": {
                  background: "rgba(0, 212, 170, 0.3)",
                  color: "rgba(0, 0, 0, 0.5)",
                }
              }}
            >
              {isRequesting ? "Requesting..." : "Allow Camera Access"}
            </Button>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  width: "100%",
                  border: "1px solid rgba(244, 67, 54, 0.3)",
                  backgroundColor: "rgba(244, 67, 54, 0.05)",
                }}
                className="vintage-alert error"
              >
                {error}
              </Alert>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                display="block"
                className="vintage-text"
              >
                Your camera feed will be processed by our FastAPI backend.
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                display="block"
                className="vintage-text"
              >
                Images are sent securely to the backend for AI analysis.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
