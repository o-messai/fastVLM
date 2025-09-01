import React, { createContext, useState, useCallback } from "react";
import type { VLMContextValue } from "../types";

const VLMContext = createContext<VLMContextValue | null>(null);

const API_BASE_URL = "http://localhost:8000";

export { VLMContext };

export const VLMProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendFrame = useCallback(
    async (imageBlob: Blob, prompt: string): Promise<string> => {
      try {
        setError(null);
        
        const formData = new FormData();
        formData.append("file", imageBlob, "frame.jpg");
        formData.append("prompt", prompt);

        const response = await fetch(`${API_BASE_URL}/caption`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setIsConnected(true);
        return data.caption || data.text || "No caption received";
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setError(errorMessage);
        setIsConnected(false);
        console.error("Error sending frame to backend:", e);
        throw e;
      }
    },
    [],
  );

  return (
    <VLMContext.Provider
      value={{
        isConnected,
        error,
        sendFrame,
      }}
    >
      {children}
    </VLMContext.Provider>
  );
};
