import { useState, useEffect } from "react";
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  LinearProgress,
} from "@mui/material";
import { Psychology, Download } from "@mui/icons-material";
import { useVLMContext } from "../context/useVLMContext";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { loadModel, isLoading, error } = useVLMContext();
  const [progress, setProgress] = useState<string>("Initializing...");
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    const loadModelAsync = async () => {
      try {
        await loadModel((msg) => {
          setProgress(msg);
          if (msg.includes("processor")) setLoadingStep(1);
          if (msg.includes("model")) setLoadingStep(2);
          if (msg.includes("successfully")) setLoadingStep(3);
        });
        onComplete();
      } catch (err) {
        console.error("Failed to load model:", err);
        setProgress("Failed to load model. Please refresh the page.");
      }
    };

    loadModelAsync();
  }, [loadModel, onComplete]);

  const steps = [
    "Initializing...",
    "Loading processor...",
    "Loading model...",
    "Model loaded successfully!",
  ];

  return (
    <Box  sx={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      px: 10 // padding so it’s not tight on small screens>
    }}>
      <Card sx={{ maxWidth: 800, width: "100%" }}>
        <CardContent sx={{ p: 6, textAlign: "center" }}>
          <Stack spacing={4} alignItems="center">
            <Box sx={{ position: "relative" }}>
              <CircularProgress
                size={120}
                thickness={4}
                sx={{ color: "primary.main" }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Psychology sx={{ fontSize: 40, color: "primary.main" }} />
              </Box>
            </Box>

            <Box>
              <Typography variant="h4" component="h2" gutterBottom>
                Loading FastVLM Model
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {progress}
              </Typography>
            </Box>

            <Box sx={{ width: "100%" }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Loading Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(loadingStep / (steps.length - 1)) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                Step {loadingStep + 1} of {steps.length}: {steps[loadingStep]}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ width: "100%" }}>
                {error}
              </Alert>
            )}

            <Stack direction="row" spacing={2} alignItems="center" color="text.secondary">
              <Download />
              <Typography variant="body2">
                This may take a few minutes on first load...
              </Typography>
            </Stack>

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Model size: ~500MB
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Subsequent loads will be much faster
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
