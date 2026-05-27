import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Marketing site is a single hash-routed SPA. Plain default build → dist/.
export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    sourcemap: false,
  },
});
