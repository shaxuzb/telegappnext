import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import viteImagemin from "vite-plugin-imagemin";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      jpeg: {
        quality: 70,
      },
      jpg: {
        quality: 70,
      },
      png: {
        quality: 70,
      },
    }),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 70 },
      svgo: {
        plugins: [{ name: "removeViewBox" }, { name: "cleanupIDs" }],
      },
    }),
  ],
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
});
