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
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={3}
    >
      <Card sx={{ maxWidth: 500, width: "100%" }}>
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          <Stack spacing={3} alignItems="center">
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "primary.main",
                mb: 2,
              }}
            >
              <CameraAlt sx={{ fontSize: 40 }} />
            </Avatar>

            <Typography variant="h4" component="h1" gutterBottom>
              Camera Access Required
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              FastVLM needs access to your camera to analyze images in real-time.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={requestPermission}
              disabled={isRequesting}
              startIcon={isRequesting ? <CircularProgress size={20} /> : <Security />}
              sx={{ minWidth: 200 }}
            >
              {isRequesting ? "Requesting..." : "Allow Camera Access"}
            </Button>

            {error && (
              <Alert severity="error" sx={{ width: "100%" }}>
                {error}
              </Alert>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Your camera feed will only be processed locally in your browser.
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                No images or video are sent to external servers.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
