// FALLBACK CONFIG FOR STACKBLITZ ONLY.
// If a fresh StackBlitz import fails with a rolldown/wasm error, replace the
// contents of vite.config.ts with this file. Do NOT use this in Lovable.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: { target: "esnext" },
});
