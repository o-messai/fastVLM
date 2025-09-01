import { useState, useEffect } from "react";
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";
import { Psychology, Cloud } from "@mui/icons-material";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [loadingText, setLoadingText] = useState("Initializing...");

  useEffect(() => {
    const loadingSteps = [
      "Initializing...",
      "Connecting to FastAPI backend...",
      "Ready to analyze video!",
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length - 1) {
        currentStep++;
        setLoadingText(loadingSteps[currentStep]);
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1000); // Wait 1 second before completing
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [onComplete]);

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
          maxWidth: 600, 
          width: "90%",
          maxHeight: "80vh",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
        }}
      >
        <CardContent sx={{ p: 6, textAlign: "center", position: "relative", zIndex: 1 }}>
          <Stack spacing={4} alignItems="center">
            <Box sx={{ position: "relative" }}>
              <CircularProgress
                size={120}
                thickness={4}
                sx={{ 
                  color: "primary.main",
                  filter: "drop-shadow(0 0 8px rgba(0, 212, 170, 0.3))"
                }}
                className="vintage-pulse"
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Psychology 
                  sx={{ 
                    fontSize: 40, 
                    color: "primary.main",
                    filter: "drop-shadow(0 0 4px rgba(0, 212, 170, 0.3))"
                  }} 
                  className="vintage-icon"
                />
              </Box>
            </Box>

            <Box>
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom
                className="retro-glow vintage-text"
              >
                FastVLM Ready
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ mb: 3 }}
                className="vintage-text"
              >
                {loadingText}
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center" color="text.secondary">
              <Cloud className="vintage-icon" />
              <Typography variant="body2" className="vintage-text">
                Using FastAPI backend for AI analysis
              </Typography>
            </Stack>

            <Box sx={{ mt: 2 }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                display="block"
                className="vintage-text"
              >
                No model downloads required
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                display="block"
                className="vintage-text"
              >
                Fast and efficient server-side processing
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
