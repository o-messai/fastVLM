export const PROMPTS = {
  default: "Describe what you see in this image in detail.",
  simple: "What do you see?",
  detailed: "Provide a comprehensive description of this image including objects, actions, and context.",
  question: "What is happening?",
} as const;

export const TIMING = {
  FRAME_CAPTURE_DELAY: 10, // 1 second between captures
} as const;
