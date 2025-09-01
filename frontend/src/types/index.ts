export interface VLMContextValue {
  isConnected: boolean;
  error: string | null;
  sendFrame: (imageBlob: Blob, prompt: string) => Promise<string>;
}

export type AppState = "requesting-permission" | "welcome" | "loading" | "captioning";
