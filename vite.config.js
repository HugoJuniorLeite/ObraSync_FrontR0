import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // ✅ OBRIGATÓRIO para SPA em S3 + CloudFront
});
