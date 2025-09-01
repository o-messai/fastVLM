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
import { PlayArrow, AutoAwesome, Psychology, Speed, Cloud } from "@mui/icons-material";

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
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
          maxWidth: 800, 
          width: "90%",
          maxHeight: "90vh",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
        }}
      >
        <CardContent sx={{ p: 6, textAlign: "center", position: "relative", zIndex: 1 }}>
          <Stack spacing={4} alignItems="center">
            <Box>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                className="retro-glow vintage-text"
                sx={{
                  background: "linear-gradient(45deg, #00d4aa 30%, #4dd8c7 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 600,
                }}
              >
                FastVLM + FastAPI + React
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                gutterBottom
                className="vintage-text"
              >
                Real-time visual language model powered by FastAPI backend
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
              <Chip
                icon={<AutoAwesome className="vintage-icon" />}
                label="AI-Powered"
                color="primary"
                variant="outlined"
                className="vintage-pulse"
              />
              <Chip
                icon={<Speed className="vintage-icon" />}
                label="Real-time"
                color="secondary"
                variant="outlined"
                className="vintage-pulse"
                sx={{ animationDelay: "0.5s" }}
              />
              <Chip
                icon={<Psychology className="vintage-icon" />}
                label="Vision AI"
                color="primary"
                variant="outlined"
                className="vintage-pulse"
                sx={{ animationDelay: "1s" }}
              />
              <Chip
                icon={<Cloud className="vintage-icon" />}
                label="Server-side"
                color="success"
                variant="outlined"
                className="vintage-pulse"
                sx={{ animationDelay: "1.5s" }}
              />
            </Stack>

            <Divider sx={{ width: "100%", borderColor: "rgba(0, 212, 170, 0.2)" }} />

            <Box>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                paragraph
                className="vintage-text"
              >
                Experience AI-powered image understanding through our FastAPI backend. 
                This application uses the FastVLM model to provide real-time descriptions 
                and analysis of your webcam feed.
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                paragraph
                className="vintage-text"
              >
                Simply point your camera at objects, scenes, or text, and get instant 
                AI-generated descriptions and answers to your questions.
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={onStart}
              startIcon={<PlayArrow className="vintage-icon" />}
              className="vintage-button"
              sx={{
                minWidth: 250,
                py: 2,
                px: 4,
                fontSize: "1.1rem",
                background: "linear-gradient(45deg, #00d4aa 0%, #4dd8c7 100%)",
                color: "#000",
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(45deg, #4dd8c7 0%, #00d4aa 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(0, 212, 170, 0.4)",
                },
              }}
            >
              Start FastVLM
            </Button>

            <Typography 
              variant="body2" 
              color="text.secondary"
              className="vintage-text"
            >
              Click to connect to the AI backend
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                display="block"
                className="vintage-text"
              >
                Powered by FastAPI + FastVLM
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
