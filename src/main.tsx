import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initScrollOptimizer } from "./utils/scrollOptimizer";
import { fixMobileCSS } from "./utils/mobileFix";

// CRITICAL: Fix mobile CSS conflicts first
fixMobileCSS();

// Initialize mobile scroll optimizer for better performance
const cleanup = initScrollOptimizer();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (cleanup) cleanup();
});

createRoot(document.getElementById("root")!).render(<App />);
