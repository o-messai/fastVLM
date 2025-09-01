export interface VLMContextValue {
  isConnected: boolean;
  error: string | null;
  sendFrame: (imageBlob: Blob, prompt: string) => Promise<string>;
  sendFrames?: (imageBlobs: Blob[], prompt: string, numFrames: number, frameJump: number) => Promise<string>;
}

export type AppState = "requesting-permission" | "welcome" | "loading" | "captioning";
