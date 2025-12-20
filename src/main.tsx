import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initScrollOptimizer } from "./utils/scrollOptimizer";

// Initialize mobile scroll optimizer for better performance
initScrollOptimizer();

createRoot(document.getElementById("root")!).render(<App />);
