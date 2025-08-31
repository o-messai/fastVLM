import { useContext } from "react";
import { VLMContext } from "./VLMContext";
import type { VLMContextValue } from "../types";

export const useVLMContext = (): VLMContextValue => {
  const context = useContext(VLMContext);
  if (!context) {
    throw new Error("useVLMContext must be used within a VLMProvider");
  }
  return context;
};
