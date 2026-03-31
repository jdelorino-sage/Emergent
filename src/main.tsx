import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/App";

// Hide the HTML-level loading fallback once React takes over
const fallback = document.getElementById("loading-fallback");
if (fallback) fallback.style.display = "none";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
