// Entry point: apply locked tokens, mount the app.

import React from "react";
import ReactDOM from "react-dom/client";
import App, { CONFIG } from "./App.jsx";
import { applyTokens } from "./tokens.js";
import "./style.css";

// Apply the locked palette + font pair before first paint.
applyTokens(CONFIG.palette, CONFIG.fontPair);
document.documentElement.dataset.font = CONFIG.fontPair;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
