import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import { PlayArrow, AutoAwesome, Psychology, Speed } from "@mui/icons-material";

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
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
            <Box>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  background: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 700,
                }}
              >
                FastVLM + FastAPI + React
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Real-time visual language model powered by FastVLM-0.5B-ONNX
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
              <Chip
                icon={<AutoAwesome />}
                label="AI-Powered"
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<Speed />}
                label="Real-time"
                color="secondary"
                variant="outlined"
              />
              <Chip
                icon={<Psychology />}
                label="Vision AI"
                color="primary"
                variant="outlined"
              />
            </Stack>

            <Divider sx={{ width: "100%" }} />

            <Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                Experience AI-powered image understanding locally in your browser. 
                This application uses the FastVLM model to provide real-time descriptions 
                and analysis of your webcam feed.
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Simply point your camera at objects, scenes, or text, and get instant 
                AI-generated descriptions and answers to your questions.
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={onStart}
              startIcon={<PlayArrow />}
              sx={{
                minWidth: 250,
                py: 2,
                px: 4,
                fontSize: "1.1rem",
                background: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)",
                "&:hover": {
                  background: "linear-gradient(45deg, #1976D2 30%, #7B1FA2 90%)",
                },
              }}
            >
              Start FastVLM
            </Button>

            <Typography variant="body2" color="text.secondary">
              Click to begin loading the AI model
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Powered by FastAPI +Hugging Face Transformers
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Model: FastVLM-0.5B-ONNX by Apple
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
